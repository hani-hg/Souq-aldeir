import firebase, { auth, db, ADMIN_EMAIL, CLOUDINARY_CLOUD, CLOUDINARY_PRESET, CATEGORIES, AREAS } from './firebase.js';

const TOKEN_KEY = 'souq_token';
const FAV_KEY = 'souq_favs';
const SEEN_KEY = 'souq_chat_seen';
const DEFAULT_MARKET_SETTINGS = { tickerEnabled: true, tickerText: 'أهلاً بكم في سوق دير الزور — تصفح الإعلانات المحلية وتواصل مباشرة مع البائعين.', tickerLink: '', featuredInterval: 3 };
const DEFAULT_CONTACT_SETTINGS = { email: '', phone: '' };

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function hasActiveSession() {
  return !!(getToken() || (auth.currentUser && auth.currentUser.uid));
}

function favsKey(uid) {
  return `${FAV_KEY}_${uid}`;
}

function getFavs() {
  const uid = getToken();
  if (!uid) return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(favsKey(uid)) || '[]'));
  } catch (e) {
    return new Set();
  }
}

function setFavs(set) {
  const uid = getToken();
  if (!uid) return;
  localStorage.setItem(favsKey(uid), JSON.stringify([...set]));
}

function isFav(id) {
  return getFavs().has(id);
}

function seenMap() {
  const uid = getToken();
  if (!uid) return {};
  try {
    return JSON.parse(localStorage.getItem(`${SEEN_KEY}_${uid}`) || '{}');
  } catch (e) {
    return {};
  }
}

function setSeen(chatId, ms) {
  const uid = getToken();
  if (!uid) return;
  const m = seenMap();
  m[chatId] = ms;
  localStorage.setItem(`${SEEN_KEY}_${uid}`, JSON.stringify(m));
}

/* ---------- helpers ---------- */

function toMs(v) {
  if (!v) return null;
  if (typeof v.toMillis === 'function') return v.toMillis();
  if (typeof v === 'number') return v;
  if (v instanceof Date) return v.getTime();
  if (typeof v === 'object' && v.seconds != null) return v.seconds * 1000;
  return null;
}

function httpError(status, message) {
  const err = new Error(message || 'حدث خطأ ما');
  err.status = status;
  return err;
}

function getCurrentUid() {
  return getToken() || (auth.currentUser && auth.currentUser.uid) || null;
}

if (typeof window !== 'undefined') {
  auth.onAuthStateChanged((u) => {
    window.dispatchEvent(new CustomEvent('souq-auth', { detail: { uid: u ? u.uid : null } }));
  });
}

function publicUser(doc, uid) {
  if (!doc || !doc.exists) return null;
  const d = doc.data();
  return {
    id: uid,
    name: d.name || 'مستخدم',
    phone: d.phone || '',
    email: d.email || '',
    role: d.role === 'admin' ? 'admin' : 'user',
    avatar: d.avatar || null,
    createdAt: toMs(d.createdAt) || 0
  };
}

function isAdminUser(u) {
  return !!u && (u.role === 'admin' || u.email === ADMIN_EMAIL);
}

async function requireUser() {
  const uid = getCurrentUid();
  if (!uid) throw httpError(401, 'غير مسجل الدخول');
  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) throw httpError(401, 'المستخدم غير موجود');
  const d = snap.data();
  if (d.banned || d.isBanned) throw httpError(403, 'تم حظر حسابك، تواصل مع الإدارة');
  return publicUser(snap, uid);
}

async function requireAdmin() {
  const user = await requireUser();
  if (!isAdminUser(user)) throw httpError(403, 'غير مصرح لك');
  return user;
}

async function getUserDoc(uid) {
  try {
    const snap = await db.collection('users').doc(uid).get();
    return snap.exists ? snap.data() : null;
  } catch (e) {
    return null;
  }
}

function serializeAd(snapOrDoc, opts = {}) {
  const doc = snapOrDoc && snapOrDoc.exists ? snapOrDoc : { id: (snapOrDoc && snapOrDoc.id) || '', data: () => snapOrDoc || {} };
  const d = doc.data ? doc.data() : (snapOrDoc || {});
  const id = doc.id;
  const createdAt = toMs(d.createdAt) || 0;
  const expiresAt = toMs(d.expiresAt) || createdAt;
  const expired = d.status !== 'sold' && expiresAt > 0 && expiresAt < Date.now();
  return {
    id,
    title: d.title || '',
    description: d.description || '',
    price: d.price || 0,
    currency: d.currency === 'SYP' ? 'SYP' : 'USD',
    phone: d.phone || '',
    category: d.category || '',
    area: d.area || '',
    customArea: d.customArea || '',
    durationDays: d.durationDays || 30,
    status: expired ? 'expired' : (d.status || 'active'),
    featured: !!d.featured,
    images: d.images || [],
    video: d.video || null,
    views: d.views || 0,
    createdAt,
    expiresAt,
    isFavorite: opts.noFav ? false : isFav(id),
    seller: {
      id: d.userId || '',
      name: d.userName || 'مستخدم',
      phone: d.userPhone || '',
      avatar: d.userAvatar || null,
      createdAt: d.userCreatedAt || 0
    }
  };
}

function isPublicActiveAd(ad) {
  return !!ad && ad.status === 'active';
}

async function uploadFile(file, isVideo) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  fd.append('folder', isVideo ? 'souq_ads_video' : 'souq_ads');
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/${isVideo ? 'auto' : 'image'}/upload`;
  const res = await fetch(url, { method: 'POST', body: fd });
  let data = null;
  try { data = await res.json(); } catch (e) {}
  if (!res.ok) throw httpError(400, (data && data.error && data.error.message) || 'فشل رفع الملف');
  return data.secure_url;
}

async function uploadFormFiles(formData) {
  const imageUrls = [];
  let videoUrl = null;
  const files = formData.getAll('images') || [];
  for (const f of files) {
    if (f && f.type && f.type.startsWith('image/')) {
      imageUrls.push(await uploadFile(f, false));
    } else if (f && f.type && f.type.startsWith('video/')) {
      videoUrl = await uploadFile(f, true);
    }
  }
  return { imageUrls, videoUrl };
}

function chatId(a, b) {
  return a < b ? `${a}_${b}` : `${b}_${a}`;
}

/* ---------- handlers ---------- */

async function handleAuthRegister(body) {
  const name = String((body && body.name) || '').trim();
  const phoneRaw = String((body && body.phone) || '').replace(/[^0-9+]/g, '');
  const password = String((body && body.password) || '');
  if (!name) throw httpError(400, 'الاسم الكامل مطلوب');
  if (!phoneRaw) throw httpError(400, 'رقم الهاتف مطلوب');
  if (password.length < 6) throw httpError(400, 'كلمة المرور 6 أحرف على الأقل');

  const phoneClean = phoneRaw.replace(/[^0-9]/g, '');
  const emailRaw = String((body && body.email) || '').trim().toLowerCase();
  const email = emailRaw && emailRaw.includes('@') ? emailRaw : `${phoneClean}@souq-aldeir.local`;

  const dup = await db.collection('users').where('phone', '==', phoneRaw).limit(1).get();
  if (!dup.empty) throw httpError(409, 'رقم الهاتف مسجل مسبقاً');

  let cred;
  try {
    cred = await auth.createUserWithEmailAndPassword(email, password);
  } catch (e) {
    const m = {
      'auth/email-already-in-use': 'رقم الهاتف أو البريد مسجل مسبقاً',
      'auth/weak-password': 'كلمة المرور ضعيفة',
      'auth/invalid-email': 'بيانات غير صحيحة'
    };
    throw httpError(400, m[e.code] || 'خطأ في إنشاء الحساب');
  }
  const uid = cred.user.uid;
  await cred.user.updateProfile({ displayName: name }).catch(() => {});
  await db.collection('users').doc(uid).set({
    name,
    phone: phoneRaw,
    email: emailRaw || '',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    agreedTermsAt: firebase.firestore.FieldValue.serverTimestamp(),
    role: 'user',
    banned: false
  });
  setToken(uid);
  return { token: uid, user: publicUser({ exists: true, data: () => ({ name, phone: phoneRaw, email: emailRaw || '', role: 'user', avatar: null, createdAt: Date.now() }) }, uid) };
}

async function handleAuthLogin(body) {
  let identifier = String((body && body.identifier) || '').trim().toLowerCase();
  const password = String((body && body.password) || '');
  if (!identifier || !password) throw httpError(400, 'أدخل رقم الهاتف/البريد وكلمة المرور');
  if (!identifier.includes('@')) {
    const clean = identifier.replace(/[^0-9+]/g, '');
    const snap = await db.collection('users').where('phone', '==', clean).limit(1).get();
    if (snap.empty) throw httpError(401, 'الحساب غير موجود');
    const found = snap.docs[0].data();
    identifier = (found.email && found.email.includes('@') && found.email) || `${clean.replace(/[^0-9]/g, '')}@souq-aldeir.local`;
  }
  let cred;
  try {
    cred = await auth.signInWithEmailAndPassword(identifier, password);
  } catch (e) {
    const m = {
      'auth/user-not-found': 'الحساب غير موجود',
      'auth/wrong-password': 'كلمة المرور خاطئة',
      'auth/invalid-email': 'بيانات غير صحيحة',
      'auth/invalid-credential': 'رقم الهاتف أو كلمة المرور خاطئة',
      'auth/too-many-requests': 'محاولات كثيرة، انتظر قليلاً'
    };
    throw httpError(401, m[e.code] || 'بيانات الدخول غير صحيحة');
  }
  const uid = cred.user.uid;
  const snap = await db.collection('users').doc(uid).get();
  const d = snap.exists ? snap.data() : {};
  if (d.banned || d.isBanned) {
    await auth.signOut();
    throw httpError(403, 'تم حظر حسابك، تواصل مع الإدارة');
  }
  setToken(uid);
  return { token: uid, user: publicUser(snap.exists ? snap : { exists: true, data: () => ({ name: cred.user.displayName || 'مستخدم', phone: '', email: cred.user.email || '', role: 'user', avatar: null, createdAt: 0 }) }, uid) };
}

async function handleAuthReset(body) {
  const phone = String((body && body.phone) || '').replace(/[^0-9+]/g, '');
  if (!phone) throw httpError(400, 'رقم الهاتف مطلوب');
  const snap = await db.collection('users').where('phone', '==', phone).limit(1).get();
  if (snap.empty) throw httpError(404, 'لا يوجد حساب بهذا الرقم');
  const d = snap.docs[0].data();
  const email = d.email || '';
  if (email && email.includes('@') && !email.endsWith('@souq-aldeir.local')) {
    await auth.sendPasswordResetEmail(email);
    return { ok: true, note: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. افحص صندوق الوارد (والرسائل غير المرغوب فيها).' };
  }
  let contact = { email: '', phone: '', whatsapp: '' };
  try {
    const c = await db.collection('settings').doc('contact').get();
    if (c.exists) contact = { ...contact, ...c.data() };
  } catch (e) {}
  return { ok: true, contact, note: 'حسابك غير مرتبط ببريد إلكتروني حقيقي. تواصل مع الإدارة لتغيير كلمة المرور.' };
}

async function handleAuthMe() {
  const uid = getCurrentUid();
  if (!uid) throw httpError(401, 'غير مسجل الدخول');
  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) {
    setToken(null);
    throw httpError(401, 'المستخدم غير موجود');
  }
  const d = snap.data();
  if (d.banned || d.isBanned) {
    setToken(null);
    throw httpError(403, 'تم حظر حسابك، تواصل مع الإدارة');
  }
  setToken(uid);
  return { user: publicUser(snap, uid) };
}

async function handleAuthUpdateMe(body) {
  const user = await requireUser();
  const uid = getCurrentUid();
  const updates = {};
  if (body && body.name && body.name.trim()) updates.name = body.name.trim();
  if (body && body.email !== undefined) {
    const em = body.email && body.email.trim() ? body.email.trim().toLowerCase() : '';
    if (em) {
      const dup = await db.collection('users').where('email', '==', em).limit(1).get();
      const dupMe = dup.docs.find((dd) => dd.id !== uid);
      if (dupMe) throw httpError(409, 'البريد الإلكتروني مستخدم من قبل');
    }
    updates.email = em;
  }
  if (Object.keys(updates).length) {
    await db.collection('users').doc(uid).update(updates);
    if (updates.email && auth.currentUser && updates.email !== auth.currentUser.email) {
      auth.currentUser.updateEmail(updates.email).catch(() => {});
    }
  }
  const snap = await db.collection('users').doc(uid).get();
  return { user: publicUser(snap, uid) };
}

async function handleAuthPassword(body) {
  const user = await requireUser();
  const uid = getCurrentUid();
  const current = String((body && body.current) || '');
  const password = String((body && body.password) || '');
  if (!current) throw httpError(400, 'كلمة المرور الحالية غير صحيحة');
  if (password.length < 6) throw httpError(400, 'كلمة المرور 6 أحرف على الأقل');
  const au = auth.currentUser;
  if (!au) throw httpError(401, 'غير مسجل الدخول');
  const email = user.email || au.email;
  try {
    await au.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(email, current));
  } catch (e) {
    throw httpError(400, 'كلمة المرور الحالية غير صحيحة');
  }
  await au.updatePassword(password);
  return { ok: true };
}

async function handleGetSettings() {
  let settings = { ...DEFAULT_CONTACT_SETTINGS };
  try {
    const doc = await db.collection('settings').doc('contact').get();
    if (doc.exists) settings = { ...settings, ...doc.data() };
  } catch (e) {}
  return { settings };
}

async function handleGetMarketSettings() {
  try {
    const doc = await db.collection('settings').doc('market').get();
    return { settings: doc.exists ? { ...DEFAULT_MARKET_SETTINGS, ...doc.data() } : DEFAULT_MARKET_SETTINGS };
  } catch (e) {
    return { settings: DEFAULT_MARKET_SETTINGS };
  }
}

async function handleStats() {
  let users = 0;
  try {
    const s = await db.collection('users').limit(1000).get();
    users = s.docs.filter((d) => d.data().role !== 'admin').length;
  } catch (e) {}
  let ads = 0;
  try {
    const s = await db.collection('ads').limit(1000).get();
    ads = s.docs.map((d) => serializeAd(d, { noFav: true })).filter(isPublicActiveAd).length;
  } catch (e) {}
  let visits = 0;
  try {
    const doc = await db.collection('settings').doc('stats').get();
    if (doc.exists) visits = doc.data().visits || 0;
  } catch (e) {}
  return { users, ads, visits };
}

async function handleVisit() {
  const ref = db.collection('settings').doc('stats');
  let visits = 0;
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const cur = snap.exists && snap.data() ? (snap.data().visits || 0) : 0;
      visits = cur + 1;
      tx.set(ref, { visits }, { merge: true });
    });
  } catch (e) {
    visits = 1;
    ref.set({ visits: firebase.firestore.FieldValue.increment(1) }, { merge: true }).catch(() => {});
  }
  return { ok: true, visits };
}

async function handleAdsList(params) {
  const search = params.get('search') || '';
  const cat = params.get('cat') || '';
  const area = params.get('area') || '';
  const min = params.get('min');
  const max = params.get('max');
  const sort = params.get('sort') || 'newest';
  const onlyFav = params.get('onlyFav') === '1';
  const userId = params.get('userId') || '';
  const limit = Number(params.get('limit') || 30);
  const offset = Number(params.get('offset') || 0);

  let favIds = null;
  if (onlyFav) favIds = getFavs();

  const snap = await db.collection('ads').limit(300).get();
  let ads = snap.docs.map((d) => serializeAd(d)).filter(Boolean);

  if (onlyFav) ads = ads.filter((a) => favIds.has(a.id));
  if (userId) ads = ads.filter((a) => a.seller.id === userId);
  ads = ads.filter(isPublicActiveAd);

  if (search) {
    const s = search.toLowerCase();
    ads = ads.filter((a) => (a.title || '').toLowerCase().includes(s) || (a.description || '').toLowerCase().includes(s));
  }
  if (cat) ads = ads.filter((a) => a.category === cat);
  if (area) ads = ads.filter((a) => (a.area === area) || (a.customArea === area));
  if (min !== null && min !== undefined && min !== '') ads = ads.filter((a) => Number(a.price) >= Number(min));
  if (max !== null && max !== undefined && max !== '') ads = ads.filter((a) => Number(a.price) <= Number(max));

  const orderMap = {
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    views: (a, b) => b.views - a.views,
    newest: (a, b) => b.createdAt - a.createdAt
  };
  const sorter = orderMap[sort] || orderMap.newest;
  ads.sort((a, b) => (b.featured - a.featured) || sorter(a, b));

  const total = ads.length;
  const page = ads.slice(offset, offset + limit);
  return { total, ads: page };
}

async function handleAdsFeatured() {
  const snap = await db.collection('ads').limit(300).get();
  const ads = snap.docs
    .map((d) => serializeAd(d))
    .filter((a) => a.featured && isPublicActiveAd(a))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 8);
  return { ads };
}

async function handleAdsMy() {
  const user = await requireUser();
  const uid = getCurrentUid();
  const snap = await db.collection('ads').where('userId', '==', uid).limit(300).get();
  const ads = snap.docs
    .map((d) => serializeAd(d))
    .filter((a) => a.status !== 'deleted')
    .sort((a, b) => b.createdAt - a.createdAt);
  return { ads };
}

async function handleAdsDetail(id) {
  if (!id) throw httpError(404, 'الإعلان غير موجود');
  const snap = await db.collection('ads').doc(id).get();
  if (!snap.exists || snap.data().status === 'deleted') throw httpError(404, 'الإعلان غير موجود');
  db.collection('ads').doc(id).update({ views: firebase.firestore.FieldValue.increment(1) }).catch(() => {});
  const ad = serializeAd(snap);
  const udoc = await getUserDoc(ad.seller.id);
  if (udoc) {
    ad.seller = {
      id: ad.seller.id,
      name: udoc.name || ad.seller.name,
      phone: udoc.phone || ad.seller.phone,
      avatar: udoc.avatar || null,
      createdAt: toMs(udoc.createdAt) || 0
    };
  }
  return { ad };
}

async function handleAdsCreate(formData) {
  const user = await requireUser();
  const uid = getCurrentUid();
  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const priceNum = Number(formData.get('price'));
  const currency = formData.get('currency') === 'SYP' ? 'SYP' : 'USD';
  const phone = String(formData.get('phone') || '').trim();
  const category = formData.get('category') || '';
  const area = formData.get('area') || '';
  const customArea = formData.get('customArea') || null;
  const duration = [30, 60, 90, 180, 365].includes(Number(formData.get('durationDays'))) ? Number(formData.get('durationDays')) : 30;

  if (!title) throw httpError(400, 'عنوان الإعلان مطلوب');
  if (!description) throw httpError(400, 'وصف الإعلان مطلوب');
  if (isNaN(priceNum) || priceNum <= 0) throw httpError(400, 'أدخل سعراً أكبر من الصفر');
  if (!phone) throw httpError(400, 'رقم الهاتف مطلوب');
  if (!category) throw httpError(400, 'الفئة مطلوبة');
  if (!area) throw httpError(400, 'المنطقة مطلوبة');

  const { imageUrls, videoUrl } = await uploadFormFiles(formData);
  const now = Date.now();
  const expiresAt = now + duration * 86400000;

  const adRef = db.collection('ads').doc();
  const adData = {
    title,
    description,
    price: priceNum,
    currency,
    phone,
    category,
    area,
    customArea,
    durationDays: duration,
    status: 'active',
    featured: false,
    images: imageUrls,
    video: videoUrl,
    views: 0,
    userId: uid,
    userName: user.name,
    userPhone: user.phone,
    userCreatedAt: user.createdAt || 0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    expiresAt: firebase.firestore.Timestamp.fromMillis(expiresAt)
  };
  await adRef.set(adData);

  return {
    ad: {
      id: adRef.id,
      title,
      description,
      price: priceNum,
      currency,
      phone,
      category,
      area,
      customArea,
      durationDays: duration,
      status: 'active',
      featured: false,
      images: imageUrls,
      video: videoUrl,
      views: 0,
      createdAt: now,
      expiresAt,
      isFavorite: false,
      seller: { id: uid, name: user.name, phone: user.phone, avatar: user.avatar || null, createdAt: user.createdAt || 0 }
    }
  };
}

async function handleAdsUpdate(id, formData) {
  const user = await requireUser();
  const uid = getCurrentUid();
  const snap = await db.collection('ads').doc(id).get();
  if (!snap.exists || snap.data().status === 'deleted') throw httpError(404, 'الإعلان غير موجود');
  const cur = snap.data();
  if (cur.userId !== uid && !isAdminUser(user)) throw httpError(403, 'لا تملك صلاحية تعديل هذا الإعلان');

  const title = String(formData.get('title') || cur.title).trim();
  const description = String(formData.get('description') || cur.description).trim();
  const price = formData.get('price') !== null && formData.get('price') !== undefined && formData.get('price') !== '' ? Number(formData.get('price')) : cur.price;
  const currency = formData.get('currency') === 'SYP' ? 'SYP' : (formData.get('currency') === 'USD' ? 'USD' : cur.currency);
  const phone = String(formData.get('phone') || cur.phone).trim();
  const category = formData.get('category') || cur.category;
  const area = formData.get('area') || cur.area;
  const customArea = formData.get('customArea') || cur.customArea || null;

  let keep = [];
  try { keep = JSON.parse(formData.get('keepImages') || '[]'); } catch (e) {}
  const { imageUrls } = await uploadFormFiles(formData);
  const images = [...keep.slice(0, 5), ...imageUrls].slice(0, 5);

  await db.collection('ads').doc(id).update({
    title,
    description,
    price,
    currency,
    phone,
    category,
    area,
    customArea,
    images
  });

  const updated = await db.collection('ads').doc(id).get();
  return { ad: serializeAd(updated) };
}

async function handleAdsDelete(id) {
  const user = await requireUser();
  const uid = getCurrentUid();
  const snap = await db.collection('ads').doc(id).get();
  if (!snap.exists) throw httpError(404, 'الإعلان غير موجود');
  const cur = snap.data();
  if (cur.userId !== uid && !isAdminUser(user)) throw httpError(403, 'غير مصرح');
  await db.collection('ads').doc(id).update({ status: 'deleted' });
  return { ok: true };
}

async function handleAdsSold(id) {
  const user = await requireUser();
  const uid = getCurrentUid();
  const snap = await db.collection('ads').doc(id).get();
  if (!snap.exists) throw httpError(404, 'الإعلان غير موجود');
  const cur = snap.data();
  if (cur.userId !== uid && !isAdminUser(user)) throw httpError(403, 'غير مصرح');
  const newStatus = cur.status === 'sold' ? 'active' : 'sold';
  await db.collection('ads').doc(id).update({ status: newStatus });
  return { ok: true, status: newStatus };
}

async function handleAdsRenew(id) {
  const user = await requireUser();
  const uid = getCurrentUid();
  const snap = await db.collection('ads').doc(id).get();
  if (!snap.exists) throw httpError(404, 'الإعلان غير موجود');
  const cur = snap.data();
  if (cur.userId !== uid) throw httpError(403, 'غير مصرح');
  const now = Date.now();
  const duration = cur.durationDays || 30;
  await db.collection('ads').doc(id).update({
    expiresAt: firebase.firestore.Timestamp.fromMillis(now + duration * 86400000),
    status: 'active'
  });
  return { ok: true };
}

async function handleAdsReport(id, body) {
  await requireUser();
  const snap = await db.collection('ads').doc(id).get();
  if (!snap.exists) throw httpError(404, 'الإعلان غير موجود');
  const uid = getCurrentUid();
  await db.collection('reports').add({
    adId: id,
    reporterId: uid,
    reason: (body && body.reason) || null,
    status: 'open',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  return { ok: true };
}

async function handleAdsFavorite(id) {
  await requireUser();
  const snap = await db.collection('ads').doc(id).get();
  if (!snap.exists) throw httpError(404, 'الإعلان غير موجود');
  const favs = getFavs();
  if (favs.has(id)) {
    favs.delete(id);
    setFavs(favs);
    return { ok: true, isFavorite: false };
  }
  favs.add(id);
  setFavs(favs);
  return { ok: true, isFavorite: true };
}

async function handleChatsList() {
  const user = await requireUser();
  const uid = getCurrentUid();
  const snap = await db.collection('chats').where('participants', 'array-contains', uid).limit(300).get();
  const seen = seenMap();
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  rows.sort((a, b) => (toMs(b.lastMessageAt) || 0) - (toMs(a.lastMessageAt) || 0));

  const partnerIds = rows.map((r) => (r.participants || []).find((p) => p !== uid)).filter(Boolean);
  const partnerMap = {};
  await Promise.all(partnerIds.map(async (pid) => {
    const udoc = await getUserDoc(pid);
    if (udoc) partnerMap[pid] = { id: pid, name: udoc.name || 'مستخدم', phone: udoc.phone || '', avatar: udoc.avatar || null, banned: !!udoc.banned || !!udoc.isBanned };
  }));

  const chats = rows
    .map((r) => {
      const partnerId = (r.participants || []).find((p) => p !== uid);
      const partner = partnerMap[partnerId] || { id: partnerId, name: (r.participantNames && r.participantNames[partnerId]) || 'مستخدم', phone: '', avatar: null, banned: false };
      const lastAt = toMs(r.lastMessageAt) || 0;
      const isUnread = r.lastSenderId && r.lastSenderId !== uid && lastAt > (seen[r.id] || 0);
      return {
        partner: { id: partner.id, name: partner.name, phone: partner.phone, avatar: partner.avatar },
        lastMessage: r.lastMessage || '',
        lastAt,
        unread: isUnread ? 1 : 0
      };
    })
    .filter((c) => c.partner && c.partner.id);

  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);
  return { chats, totalUnread };
}

async function handleChatsThread(partnerId) {
  const user = await requireUser();
  const uid = getCurrentUid();
  if (partnerId === uid) throw httpError(400, 'لا يمكن المراسلة مع نفسك');
  const psnap = await db.collection('users').doc(partnerId).get();
  if (!psnap.exists) throw httpError(404, 'المستخدم غير موجود');
  const pdata = psnap.data();
  if (pdata.banned || pdata.isBanned) throw httpError(404, 'المستخدم غير موجود');

  const cid = chatId(uid, partnerId);
  const msgs = await db.collection('chats').doc(cid).collection('messages').orderBy('createdAt').limit(200).get();
  const messages = msgs.docs.map((m) => {
    const d = m.data();
    return { id: m.id, chatId: cid, senderId: d.senderId || '', receiverId: partnerId, text: d.text || '', read: !!d.read, createdAt: toMs(d.createdAt) || 0 };
  });
  setSeen(cid, Date.now());
  return {
    partner: { id: partnerId, name: pdata.name || 'مستخدم', phone: pdata.phone || '', avatar: pdata.avatar || null },
    messages
  };
}

async function handleChatsSend(partnerId, body) {
  const user = await requireUser();
  const uid = getCurrentUid();
  const text = String((body && body.text) || '').trim();
  if (!text) throw httpError(400, 'اكتب نص الرسالة');
  if (partnerId === uid) throw httpError(400, 'لا يمكن المراسلة مع نفسك');
  const psnap = await db.collection('users').doc(partnerId).get();
  if (!psnap.exists) throw httpError(404, 'المستخدم غير موجود');
  const pdata = psnap.data();
  if (pdata.banned || pdata.isBanned) throw httpError(404, 'المستخدم غير موجود');

  const cid = chatId(uid, partnerId);
  const chatRef = db.collection('chats').doc(cid);
  const now = Date.now();
  await chatRef.set({
    participants: [uid, partnerId],
    participantNames: { [uid]: user.name, [partnerId]: pdata.name || 'مستخدم' },
    lastMessage: text,
    lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastSenderId: uid
  }, { merge: true });

  const msgRef = await chatRef.collection('messages').add({
    text,
    senderId: uid,
    senderName: user.name,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    read: false
  });
  setSeen(cid, now);
  db.collection('settings').doc('counters').set({ messages: firebase.firestore.FieldValue.increment(1) }, { merge: true }).catch(() => {});

  return {
    message: { id: msgRef.id, chatId: cid, senderId: uid, receiverId: partnerId, text, read: false, createdAt: now }
  };
}

async function handleChatsMeta(partnerId) {
  const user = await requireUser();
  const uid = getCurrentUid();
  const cid = chatId(uid, partnerId);
  const seen = seenMap();
  let unread = 0;
  try {
    const doc = await db.collection('chats').doc(cid).get();
    if (doc.exists) {
      const d = doc.data();
      const lastAt = toMs(d.lastMessageAt) || 0;
      if (d.lastSenderId && d.lastSenderId !== uid && lastAt > (seen[cid] || 0)) unread = 1;
    }
  } catch (e) {}
  return { unread };
}

async function handleAdminStats() {
  await requireAdmin();
  const now = Date.now();
  let users = 0, newUsers7 = 0, messages = 0, reports = 0, adsTotal = 0, activeAds = 0, newAds7 = 0;
  let byCat = [];
  let last14 = [];

  try {
    const us = await db.collection('users').limit(1000).get();
    const docs = us.docs.map((d) => d.data());
    users = docs.filter((d) => d.role !== 'admin').length;
    newUsers7 = docs.filter((d) => (toMs(d.createdAt) || 0) > now - 7 * 86400000).length;
  } catch (e) {}

  try {
    const as = await db.collection('ads').limit(1000).get();
    const docs = as.docs.map((d) => d.data());
    adsTotal = docs.filter((d) => d.status !== 'deleted').length;
    activeAds = docs.filter((d) => d.status === 'active' && (toMs(d.expiresAt) || 0) > now).length;
    newAds7 = docs.filter((d) => d.status !== 'deleted' && (toMs(d.createdAt) || 0) > now - 7 * 86400000).length;
    const catMap = {};
    docs.filter((d) => d.status !== 'deleted').forEach((d) => { catMap[d.category] = (catMap[d.category] || 0) + 1; });
    byCat = Object.entries(catMap).map(([category, c]) => ({ category, c })).sort((a, b) => b.c - a.c).slice(0, 12);
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const start = new Date(now - i * 86400000);
      start.setHours(0, 0, 0, 0);
      const end = start.getTime() + 86400000;
      const count = docs.filter((d) => d.status !== 'deleted' && (toMs(d.createdAt) || 0) >= start.getTime() && (toMs(d.createdAt) || 0) < end).length;
      days.push({ day: `${start.getMonth() + 1}/${start.getDate()}`, count });
    }
    last14 = days;
  } catch (e) {}

  try {
    const rs = await db.collection('reports').limit(1000).get();
    reports = rs.size;
  } catch (e) {}

  try {
    const c = await db.collection('settings').doc('counters').get();
    if (c.exists) messages = c.data().messages || 0;
  } catch (e) {}

  return { users, ads: adsTotal, activeAds, messages, reports, newUsers7, newAds7, byCat, last14 };
}

async function handleAdminAds(params) {
  await requireAdmin();
  const search = (params.get('search') || '').toLowerCase();
  const snap = await db.collection('ads').limit(300).get();
  let ads = snap.docs.map((d) => serializeAd(d)).filter((a) => a.status !== 'deleted');
  if (search) ads = ads.filter((a) => (a.title || '').toLowerCase().includes(search) || (a.description || '').toLowerCase().includes(search));
  ads.sort((a, b) => b.createdAt - a.createdAt);
  return { ads };
}

async function handleAdminUsers() {
  await requireAdmin();
  const snap = await db.collection('users').limit(1000).get();
  const users = snap.docs.map((d) => {
    const dd = d.data();
    return { id: d.id, name: dd.name || 'مستخدم', phone: dd.phone || '', email: dd.email || '', role: dd.role === 'admin' ? 'admin' : 'user', isBanned: !!dd.banned || !!dd.isBanned, createdAt: toMs(dd.createdAt) || 0, adsCount: 0 };
  });
  users.sort((a, b) => b.createdAt - a.createdAt);
  const adSnap = await db.collection('ads').limit(1000).get();
  const counts = {};
  adSnap.docs.forEach((d) => {
    const uid = d.data().userId;
    if (d.data().status !== 'deleted') counts[uid] = (counts[uid] || 0) + 1;
  });
  users.forEach((u) => { u.adsCount = counts[u.id] || 0; });
  return { users };
}

async function handleAdminReports() {
  await requireAdmin();
  const snap = await db.collection('reports').limit(100).get();
  const reports = await Promise.all(snap.docs.map(async (d) => {
    const dd = d.data();
    let adTitle = '';
    let reporterName = null;
    try {
      const a = await db.collection('ads').doc(dd.adId || '').get();
      if (a.exists) adTitle = a.data().title || '';
    } catch (e) {}
    if (dd.reporterId) {
      const r = await getUserDoc(dd.reporterId);
      if (r) reporterName = r.name || null;
    }
    return { id: d.id, reason: dd.reason || null, createdAt: toMs(dd.createdAt) || 0, adId: dd.adId || '', adTitle, reporterName };
  }));
  reports.sort((a, b) => b.createdAt - a.createdAt);
  return { reports };
}

async function handleAdminAdToggle(id) {
  await requireAdmin();
  const snap = await db.collection('ads').doc(id).get();
  if (!snap.exists) throw httpError(404, 'الإعلان غير موجود');
  const newStatus = snap.data().status === 'active' ? 'hidden' : 'active';
  await db.collection('ads').doc(id).update({ status: newStatus });
  return { ok: true, status: newStatus };
}

async function handleAdminAdFeature(id) {
  await requireAdmin();
  const snap = await db.collection('ads').doc(id).get();
  if (!snap.exists) throw httpError(404, 'الإعلان غير موجود');
  const featured = !snap.data().featured;
  await db.collection('ads').doc(id).update({ featured });
  return { ok: true, featured };
}

async function handleAdminAdDelete(id) {
  await requireAdmin();
  const snap = await db.collection('ads').doc(id).get();
  if (!snap.exists) throw httpError(404, 'الإعلان غير موجود');
  await db.collection('ads').doc(id).update({ status: 'deleted' });
  return { ok: true };
}

async function handleAdminReportDelete(id) {
  await requireAdmin();
  await db.collection('reports').doc(id).delete();
  return { ok: true };
}

async function handleAdminUserBan(id) {
  await requireAdmin();
  const snap = await db.collection('users').doc(id).get();
  if (!snap.exists) throw httpError(404, 'المستخدم غير موجود');
  if (snap.data().role === 'admin') throw httpError(403, 'لا يمكن حظر مدير');
  const isBanned = !(snap.data().banned || snap.data().isBanned);
  await db.collection('users').doc(id).update({ banned: isBanned, isBanned });
  return { ok: true, isBanned };
}

async function handleAdminSettingsGet() {
  await requireAdmin();
  let settings = { ...DEFAULT_CONTACT_SETTINGS };
  try {
    const doc = await db.collection('settings').doc('contact').get();
    if (doc.exists) settings = { ...settings, ...doc.data() };
  } catch (e) {}
  return { settings };
}

async function handleAdminSettingsPut(body) {
  await requireAdmin();
  let cur = { ...DEFAULT_CONTACT_SETTINGS };
  try {
    const doc = await db.collection('settings').doc('contact').get();
    if (doc.exists) cur = { ...cur, ...doc.data() };
  } catch (e) {}
  const next = {
    email: (body && body.email) || cur.email,
    phone: (body && body.phone) || cur.phone
  };
  await db.collection('settings').doc('contact').set(next, { merge: true });
  return { settings: next };
}

async function handleAdminMarketSettingsGet() {
  await requireAdmin();
  return handleGetMarketSettings();
}

async function handleAdminMarketSettingsPut(body) {
  await requireAdmin();
  const current = (await handleGetMarketSettings()).settings;
  const rawLink = String((body && body.tickerLink) ?? current.tickerLink ?? '').trim();
  const tickerLink = /^https:\/\//i.test(rawLink) ? rawLink : '';
  const featuredInterval = Math.min(10, Math.max(3, Number((body && body.featuredInterval) ?? current.featuredInterval) || 3));
  const next = {
    tickerEnabled: body && body.tickerEnabled !== undefined ? Boolean(body.tickerEnabled) : current.tickerEnabled,
    tickerText: String((body && body.tickerText) ?? current.tickerText ?? '').trim().slice(0, 180),
    tickerLink,
    featuredInterval
  };
  await db.collection('settings').doc('market').set(next, { merge: true });
  return { settings: next };
}

/* ---------- router ---------- */

function parseUrl(url) {
  const qIdx = url.indexOf('?');
  const path = qIdx === -1 ? url : url.slice(0, qIdx);
  const params = new URLSearchParams(qIdx === -1 ? '' : url.slice(qIdx + 1));
  return { path: path.replace(/^\/api\/?/, '').replace(/\/$/, ''), params };
}

const AD_SUB = ['categories', 'areas', 'featured', 'my'];

async function route(method, url, body) {
  const { path, params } = parseUrl(url);
  const seg = path.split('/').filter(Boolean);

  try {
    if (seg[0] === 'auth') {
      if (seg[1] === 'register' && method === 'POST') return await handleAuthRegister(body);
      if (seg[1] === 'login' && method === 'POST') return await handleAuthLogin(body);
      if (seg[1] === 'reset' && method === 'POST') return await handleAuthReset(body);
      if (seg[1] === 'me' && method === 'GET') return await handleAuthMe();
      if (seg[1] === 'me' && method === 'PUT') return await handleAuthUpdateMe(body);
      if (seg[1] === 'password' && method === 'PUT') return await handleAuthPassword(body);
    }

    if (seg[0] === 'settings' && seg.length === 1 && method === 'GET') {
      return await handleGetSettings();
    }

    if (seg[0] === 'market-settings' && seg.length === 1 && method === 'GET') {
      return await handleGetMarketSettings();
    }

    if (seg[0] === 'stats' && seg.length === 1 && method === 'GET') {
      return await handleStats();
    }

    if (seg[0] === 'visit' && seg.length === 1 && method === 'POST') {
      return await handleVisit();
    }

    if (seg[0] === 'ads') {
      if (seg.length === 1 && method === 'GET') return await handleAdsList(params);
      if (seg.length === 1 && method === 'POST') return await handleAdsCreate(body);
      if (seg.length === 2 && AD_SUB.includes(seg[1])) {
        if (seg[1] === 'categories' && method === 'GET') return CATEGORIES;
        if (seg[1] === 'areas' && method === 'GET') return AREAS;
        if (seg[1] === 'featured' && method === 'GET') return await handleAdsFeatured();
        if (seg[1] === 'my' && method === 'GET') return await handleAdsMy();
      }
      if (seg.length === 2 && !AD_SUB.includes(seg[1])) {
        const id = seg[1];
        if (method === 'GET') return await handleAdsDetail(id);
        if (method === 'PUT') return await handleAdsUpdate(id, body);
        if (method === 'DELETE') return await handleAdsDelete(id);
      }
      if (seg.length === 3 && !AD_SUB.includes(seg[1])) {
        const id = seg[1];
        const action = seg[2];
        if (method === 'POST') {
          if (action === 'sold') return await handleAdsSold(id);
          if (action === 'renew') return await handleAdsRenew(id);
          if (action === 'report') return await handleAdsReport(id, body);
          if (action === 'favorite') return await handleAdsFavorite(id);
        }
        if (action === 'contacts' && method === 'GET') {
          const snap = await db.collection('ads').doc(id).get();
          if (!snap.exists) throw httpError(404, 'الإعلان غير موجود');
          const d = snap.data();
          const owner = await getUserDoc(d.userId || '');
          return { adPhone: d.phone || '', owner: owner ? { id: d.userId, name: owner.name } : { id: d.userId || '', name: 'مستخدم' } };
        }
      }
    }

    if (seg[0] === 'chats') {
      if (seg.length === 1 && method === 'GET') return await handleChatsList();
      if (seg.length === 2) {
        if (method === 'GET') return await handleChatsThread(seg[1]);
        if (method === 'POST') return await handleChatsSend(seg[1], body);
      }
      if (seg.length === 3 && seg[2] === 'meta' && method === 'GET') {
        return await handleChatsMeta(seg[1]);
      }
    }

    if (seg[0] === 'admin') {
      if (seg[1] === 'stats' && method === 'GET') return await handleAdminStats();
      if (seg[1] === 'ads' && seg.length === 2 && method === 'GET') return await handleAdminAds(params);
      if (seg[1] === 'ads' && seg.length === 4 && method === 'POST') {
        if (seg[3] === 'toggle') return await handleAdminAdToggle(seg[2]);
        if (seg[3] === 'feature') return await handleAdminAdFeature(seg[2]);
      }
      if (seg[1] === 'ads' && seg.length === 3 && method === 'DELETE') return await handleAdminAdDelete(seg[2]);
      if (seg[1] === 'users' && seg.length === 2 && method === 'GET') return await handleAdminUsers();
      if (seg[1] === 'users' && seg.length === 4 && seg[3] === 'ban' && method === 'POST') return await handleAdminUserBan(seg[2]);
      if (seg[1] === 'reports' && seg.length === 2 && method === 'GET') return await handleAdminReports();
      if (seg[1] === 'reports' && seg.length === 3 && method === 'DELETE') return await handleAdminReportDelete(seg[2]);
      if (seg[1] === 'settings' && seg.length === 2 && method === 'GET') return await handleAdminSettingsGet();
      if (seg[1] === 'settings' && seg.length === 2 && method === 'PUT') return await handleAdminSettingsPut(body);
      if (seg[1] === 'market-settings' && seg.length === 2 && method === 'GET') return await handleAdminMarketSettingsGet();
      if (seg[1] === 'market-settings' && seg.length === 2 && method === 'PUT') return await handleAdminMarketSettingsPut(body);
    }

    throw httpError(404, 'المسار غير موجود');
  } catch (e) {
    if (e && e.status) throw e;
    throw httpError(500, (e && e.message) || 'خطأ في الخادم');
  }
}

export const api = {
  get: (p) => route('GET', p),
  post: (p, body) => route('POST', p, body),
  put: (p, body) => route('PUT', p, body),
  delete: (p) => route('DELETE', p),
  upload: (p, formData) => route('POST', p, formData)
};
