import { admin, initFirebaseAdmin, verifyFirebaseIdToken } from './_lib/firebase-admin.js';
import { FieldValue } from 'firebase-admin/firestore';

const MAX_RECIPIENTS = 500;
const MAX_MESSAGE_LENGTH = 2000;
const ALLOWED_KINDS = new Set(['gift', 'general', 'private']);

function cleanText(value, max) {
  return String(value || '').trim().slice(0, max);
}

function plainPushText(value) {
  return String(value || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\(https?:\/\/[^\s)]+\)/gi, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);
}

function getBearerToken(req) {
  const auth = String(req.headers.authorization || '');
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

async function authenticate(idToken) {
  if (!idToken) {
    const error = new Error('authentication_required');
    error.status = 401;
    throw error;
  }
  const decoded = await verifyFirebaseIdToken(idToken);
  initFirebaseAdmin();
  const userRecord = await admin.auth().getUser(decoded.uid);
  return { uid: decoded.uid, userRecord };
}

async function requireAdmin(actor) {
  if (actor.userRecord.customClaims?.admin !== true) {
    const error = new Error('admin_required');
    error.status = 403;
    throw error;
  }
  return actor;
}

async function checkRateLimit(firestore, uid) {
  const ref = firestore.collection('adminMessageRateLimits').doc(uid);
  const now = Date.now();
  return firestore.runTransaction(async tx => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() : {};
    const startedAt = Number(data.startedAtMs || 0);
    const count = startedAt && now - startedAt < 60 * 60 * 1000 ? Number(data.count || 0) : 0;
    if (count >= 20) return false;
    tx.set(ref, { startedAtMs: count ? startedAt : now, count: count + 1, updatedAt: FieldValue.serverTimestamp() });
    return true;
  });
}

async function saveWelcomeTemplate(firestore, req, actor) {
  const title = cleanText(req.body?.title, 120);
  const body = cleanText(req.body?.body, MAX_MESSAGE_LENGTH);
  if (!title || !body) return { status: 400, body: { error: 'title_and_message_required' } };
  await firestore.collection('adminMessageTemplates').doc('welcome').set({
    title, body, active: true, updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid
  });
  return { status: 200, body: { ok: true, active: true } };
}

async function deliverWelcome(firestore, actor) {
  const profileRef = firestore.collection('users').doc(actor.uid);
  const [profileSnap, templateSnap] = await Promise.all([
    profileRef.get(),
    firestore.collection('adminMessageTemplates').doc('welcome').get()
  ]);
  if (!profileSnap.exists || profileSnap.data()?.role !== 'user' || profileSnap.data()?.banned === true) {
    return { status: 403, body: { error: 'eligible_new_user_required' } };
  }
  const createdAt = actor.userRecord.metadata?.creationTime ? Date.parse(actor.userRecord.metadata.creationTime) : 0;
  if (!createdAt || Date.now() - createdAt > 24 * 60 * 60 * 1000) {
    return { status: 403, body: { error: 'new_account_required' } };
  }
  const template = templateSnap.data();
  if (!template?.active || !template.title || !template.body) return { status: 200, body: { ok: true, delivered: false } };

  const messageRef = profileRef.collection('inbox').doc(`welcome_${actor.uid}`);
  const created = await firestore.runTransaction(async tx => {
    const existing = await tx.get(messageRef);
    if (existing.exists) return false;
    tx.set(messageRef, {
      kind: 'welcome', title: cleanText(template.title, 120), body: cleanText(template.body, MAX_MESSAGE_LENGTH),
      createdAt: FieldValue.serverTimestamp(), read: false, sender: 'سوق دير الزور'
    });
    return true;
  });
  return { status: 200, body: { ok: true, delivered: created } };
}

async function getRecipients(firestore, audience, selectedIds) {
  let snapshots;
  if (audience === 'selected') {
    if (!Array.isArray(selectedIds) || !selectedIds.length || selectedIds.length > MAX_RECIPIENTS) {
      return { error: { status: 400, body: { error: `selected_recipients_must_be_1_to_${MAX_RECIPIENTS}` } } };
    }
    const uniqueIds = [...new Set(selectedIds.map(id => cleanText(id, 128)).filter(Boolean))];
    const docs = await Promise.all(uniqueIds.map(uid => firestore.collection('users').doc(uid).get()));
    snapshots = docs.filter(doc => doc.exists && doc.data()?.role === 'user' && doc.data()?.banned !== true);
  } else if (audience === 'all' || audience === 'active' || audience === 'banned') {
    let query = firestore.collection('users').where('role', '==', 'user');
    if (audience === 'active') query = query.where('banned', '==', false);
    if (audience === 'banned') query = query.where('banned', '==', true);
    const result = await query.limit(MAX_RECIPIENTS + 1).get();
    if (result.size > MAX_RECIPIENTS) {
      return { error: { status: 413, body: { error: 'recipient_limit_exceeded', limit: MAX_RECIPIENTS } } };
    }
    snapshots = result.docs;
  } else {
    return { error: { status: 400, body: { error: 'invalid_audience' } } };
  }
  if (snapshots.length > MAX_RECIPIENTS) {
    return { error: { status: 413, body: { error: 'recipient_limit_exceeded', limit: MAX_RECIPIENTS } } };
  }
  return { recipients: snapshots };
}

async function sendCampaign(firestore, actor, req) {
  const kind = cleanText(req.body?.kind, 20);
  const audience = cleanText(req.body?.audience, 20);
  const title = cleanText(req.body?.title, 120);
  const body = cleanText(req.body?.body, MAX_MESSAGE_LENGTH);
  const sendPush = req.body?.sendPush === true;
  if (!ALLOWED_KINDS.has(kind) || !title || !body) {
    return { status: 400, body: { error: 'invalid_message_fields' } };
  }
  const selectedIds = Array.isArray(req.body?.selectedUserIds) ? req.body.selectedUserIds : [];
  if (kind === 'private' && (audience !== 'selected' || new Set(selectedIds).size !== 1)) {
    return { status: 400, body: { error: 'private_message_requires_one_recipient' } };
  }
  const allowed = await checkRateLimit(firestore, actor.uid);
  if (!allowed) return { status: 429, body: { error: 'hourly_message_limit_reached' } };

  const result = await getRecipients(firestore, audience, selectedIds);
  if (result.error) return result.error;
  const recipients = result.recipients;
  if (!recipients.length) return { status: 400, body: { error: 'no_eligible_recipients' } };

  const campaignId = cleanText(req.body?.campaignId, 80);
  if (!/^[A-Za-z0-9_-]{12,80}$/.test(campaignId)) return { status: 400, body: { error: 'invalid_campaign_id' } };
  const campaignRef = firestore.collection('adminMessageCampaigns').doc(campaignId);
  const existingCampaign = await campaignRef.get();
  if (existingCampaign.exists) return { status: 409, body: { error: 'campaign_already_processed' } };

  for (let offset = 0; offset < recipients.length; offset += 400) {
    const batch = firestore.batch();
    recipients.slice(offset, offset + 400).forEach(userDoc => {
      const messageRef = userDoc.ref.collection('inbox').doc(`${campaignId}_${userDoc.id}`);
      batch.set(messageRef, {
        kind, title, body, createdAt: FieldValue.serverTimestamp(), read: false,
        sender: 'سوق دير الزور', campaignId
      });
    });
    await batch.commit();
  }

  await campaignRef.create({
    actorUid: actor.uid, kind, audience, recipientCount: recipients.length,
    title, body, sendPush, createdAt: FieldValue.serverTimestamp(), status: 'sent'
  });

  let pushSent = 0;
  let pushFailed = false;
  if (sendPush) {
    const tokens = recipients.flatMap(userDoc => {
      const stored = Array.isArray(userDoc.data()?.fcmTokens) ? userDoc.data().fcmTokens : [];
      return stored.filter(token => typeof token === 'string' && token.length > 20).slice(0, 10);
    });
    const messageBody = plainPushText(body);
    try {
      for (let offset = 0; offset < tokens.length; offset += 500) {
        const response = await admin.messaging().sendEachForMulticast({
          tokens: tokens.slice(offset, offset + 500),
          notification: { title, body: messageBody },
          webpush: { fcmOptions: { link: '/' }, notification: { icon: '/icons/icon-192.png' } },
          data: { kind: 'admin_message', campaignId }
        });
        pushSent += response.successCount;
      }
    } catch (error) {
      pushFailed = true;
      console.warn('admin-messages push delivery:', error?.code || 'failed');
    }
  }
  return { status: 200, body: { ok: true, recipientCount: recipients.length, pushSent, pushFailed } };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  try {
    const authenticated = await authenticate(getBearerToken(req));
    const firestore = admin.firestore();
    const action = cleanText(req.body?.action, 30);
    const result = action === 'deliver-welcome'
      ? await deliverWelcome(firestore, authenticated)
      : action === 'save-welcome'
        ? await saveWelcomeTemplate(firestore, req, await requireAdmin(authenticated))
        : action === 'dispatch'
          ? await sendCampaign(firestore, await requireAdmin(authenticated), req)
          : { status: 400, body: { error: 'invalid_action' } };
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('admin-messages:', error?.code || error?.message || error);
    const status = Number(error?.status) || 503;
    return res.status(status).json({ error: status < 500 ? error.message : 'message_service_unavailable' });
  }
}
