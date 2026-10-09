/* Celebration modals and one-time user notices. */
let featureNoticeUnsubscribe = null;
let activeCelebrationId = null;
let featureNoticeQueue = [];
let queuedFeatureNoticeIds = new Set();
let processingFeatureNotice = false;

function launchCelebration() {
  if (typeof window.confetti !== 'function') return;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const colors = ['#1565c0', '#f9a825', '#ef5350', '#26a69a', '#ffffff'];
  window.confetti({ particleCount: reducedMotion ? 35 : 110, spread: 95, startVelocity: 38, origin: { y: 0.58 }, colors, zIndex: 12001 });
  if (reducedMotion) return;
  const stopAt = Date.now() + 2200;
  (function fireworks() {
    const remaining = stopAt - Date.now();
    if (remaining <= 0) return;
    const count = Math.max(3, Math.round(10 * remaining / 2200));
    window.confetti({ particleCount: count, angle: 60, spread: 60, startVelocity: 48, origin: { x: 0.08, y: 0.62 }, colors, zIndex: 12001 });
    window.confetti({ particleCount: count, angle: 120, spread: 60, startVelocity: 48, origin: { x: 0.92, y: 0.62 }, colors, zIndex: 12001 });
    requestAnimationFrame(fireworks);
  })();
}

function openCelebrationModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  if (activeCelebrationId && activeCelebrationId !== id) closeCelebrationModal(activeCelebrationId);
  activeCelebrationId = id;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  launchCelebration();
  modal.querySelector('.celebration-close')?.focus({ preventScroll: true });
}

function closeCelebrationModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
  if (activeCelebrationId === id) activeCelebrationId = null;
  if (id === 'featureAwardModal') processingFeatureNotice = false;
  setTimeout(processFeatureNoticeQueue, 80);
}

function showWelcomeCelebration(name) {
  const greeting = document.getElementById('welcomeGreeting');
  if (greeting) greeting.textContent = name ? `أهلًا ${name}،` : 'أهلًا بك،';
  openCelebrationModal('welcomeGiftModal');
}

function addFeatureNoticeToBatch(batch, userId, adId, durationDays) {
  if (!userId || !adId || ![3, 7, 15, 30].includes(Number(durationDays))) {
    throw new Error('بيانات إشعار التمييز غير مكتملة');
  }
  const ref = db.collection('featureNotices').doc();
  batch.set(ref, {
    userId,
    adId,
    durationDays: Number(durationDays),
    shown: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  return ref;
}

function startFeatureNoticeListener(userId) {
  stopFeatureNoticeListener();
  if (!userId) return;
  featureNoticeUnsubscribe = db.collection('featureNotices')
    .where('userId', '==', userId)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const notice = { id: change.doc.id, ref: change.doc.ref, ...change.doc.data() };
        if (notice.shown === false && !queuedFeatureNoticeIds.has(notice.id)) {
          queuedFeatureNoticeIds.add(notice.id);
          featureNoticeQueue.push(notice);
        }
      });
      processFeatureNoticeQueue();
    }, error => console.warn('تعذر تحميل إشعارات التمييز:', error));
}

function stopFeatureNoticeListener() {
  if (featureNoticeUnsubscribe) featureNoticeUnsubscribe();
  featureNoticeUnsubscribe = null;
  featureNoticeQueue = [];
  queuedFeatureNoticeIds.clear();
  processingFeatureNotice = false;
  if (activeCelebrationId === 'featureAwardModal') closeCelebrationModal('featureAwardModal');
}

async function processFeatureNoticeQueue() {
  if (processingFeatureNotice || activeCelebrationId || !featureNoticeQueue.length) return;
  const notice = featureNoticeQueue.shift();
  processingFeatureNotice = true;
  try {
    await notice.ref.update({ shown: true, shownAt: firebase.firestore.FieldValue.serverTimestamp() });
  } catch (error) {
    const latest = await notice.ref.get().catch(() => null);
    if (latest?.exists && latest.data().shown === true) {
      queuedFeatureNoticeIds.delete(notice.id);
      processingFeatureNotice = false;
      processFeatureNoticeQueue();
      return;
    }
    console.warn('تعذر تأكيد عرض إشعار التمييز:', error);
    if (!['unavailable', 'deadline-exceeded', 'aborted', 'network-request-failed'].includes(error?.code)) {
      queuedFeatureNoticeIds.delete(notice.id);
      processingFeatureNotice = false;
      processFeatureNoticeQueue();
      return;
    }
    featureNoticeQueue.unshift(notice);
    processingFeatureNotice = false;
    setTimeout(processFeatureNoticeQueue, 5000);
    return;
  }
  const days = [3, 7, 15, 30].includes(Number(notice.durationDays)) ? Number(notice.durationDays) : 7;
  const dayLabel = days === 3 || days === 7 ? `${days} أيام` : `${days} يومًا`;
  const message = document.getElementById('featureAwardMessage');
  if (message) message.textContent = `مبروك! تم منحك إعلانًا مميزًا لمدة ${dayLabel}، هدية من سوق دير الزور.`;
  const button = document.getElementById('featureAwardAdButton');
  if (button) button.dataset.adId = notice.adId || '';
  openCelebrationModal('featureAwardModal');
}

async function openFeaturedAwardAd() {
  const button = document.getElementById('featureAwardAdButton');
  const adId = button?.dataset.adId;
  closeCelebrationModal('featureAwardModal');
  if (!adId) { showToast('تعذر العثور على الإعلان', 'bad'); return; }
  try {
    let ad = (allAds || []).find(item => item.id === adId);
    if (!ad) {
      const doc = await db.collection('ads').doc(adId).get();
      if (!doc.exists) throw new Error('ad-not-found');
      ad = { id: doc.id, ...doc.data() };
      allAds = [ad, ...(allAds || []).filter(item => item.id !== adId)];
    }
    const url = new URL(location.href);
    url.searchParams.set('ad', adId);
    history.pushState({ featuredAd: adId }, '', url);
    openDetail(adId);
  } catch (error) {
    console.error('تعذر فتح الإعلان المميز:', error);
    showToast('تعذر فتح الإعلان الآن، حاول من قائمة إعلاناتك', 'bad');
  }
}
