/* Public audio player + admin audio management. Audio is stored in Cloudinary as a video/audio asset. */
let siteAudioSettings = null;
let siteAudio = null;
let audioFirstTouchBound = false;

function audioEscape(value) {
  return typeof escapeHtml === 'function' ? escapeHtml(String(value ?? '')) : String(value ?? '');
}

function audioButton() {
  return document.getElementById('audioToggle');
}

function updateAudioButton() {
  const button = audioButton();
  if (!button) return;
  const available = !!(siteAudioSettings?.enabled && siteAudioSettings?.url);
  const playing = !!(siteAudio && !siteAudio.paused);
  button.disabled = !available;
  button.textContent = playing ? '🔊' : '🔇';
  button.title = !available ? 'لا يوجد مقطع صوتي مفعّل' : (playing ? 'إيقاف الصوت' : 'تشغيل الصوت');
  button.setAttribute('aria-label', button.title);
  button.classList.toggle('is-playing', playing);
}

async function playSiteAudio() {
  if (!siteAudioSettings?.enabled || !siteAudioSettings?.url) return false;
  if (!siteAudio) return false;
  try {
    await siteAudio.play();
    updateAudioButton();
    return true;
  } catch (_) {
    updateAudioButton();
    return false;
  }
}

function toggleSiteAudio() {
  if (!siteAudioSettings?.enabled || !siteAudioSettings?.url) {
    showToast('لا يوجد مقطع صوتي مفعّل حاليًا', 'bad');
    return;
  }
  if (siteAudio && !siteAudio.paused) {
    siteAudio.pause();
    updateAudioButton();
  } else {
    playSiteAudio();
  }
}

function bindAudioFirstTouch() {
  if (audioFirstTouchBound) return;
  audioFirstTouchBound = true;
  const firstTouch = () => {
    if (!siteAudioSettings?.enabled || !siteAudioSettings?.url || !siteAudio?.paused) return;
    document.removeEventListener('pointerdown', firstTouch, true);
    playSiteAudio();
  };
  document.addEventListener('pointerdown', firstTouch, { capture: true, passive: true });
}

async function loadSiteAudio() {
  try {
    const doc = await db.collection('settings').doc('audio').get();
    siteAudioSettings = doc.exists ? doc.data() : null;
    if (siteAudioSettings?.url) {
      siteAudio = new Audio(siteAudioSettings.url);
      siteAudio.preload = 'none';
      siteAudio.addEventListener('play', updateAudioButton);
      siteAudio.addEventListener('pause', updateAudioButton);
      siteAudio.addEventListener('ended', updateAudioButton);
    }
  } catch (_) {
    siteAudioSettings = null;
  }
  updateAudioButton();
  bindAudioFirstTouch();
}

async function audioAuthHeaders() {
  const user = auth.currentUser || currentUser;
  if (!user) throw new Error('auth-required');
  return { Authorization: `Bearer ${await user.getIdToken()}` };
}

async function requestAudioSignature(file) {
  const response = await fetch('/api/audio-sign', {
    method: 'POST',
    headers: { ...(await audioAuthHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, contentType: file.type, bytes: file.size })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'signature-failed');
  return data;
}

async function deleteAudioAsset(publicId) {
  if (!publicId) return;
  const response = await fetch('/api/audio-delete', {
    method: 'POST',
    headers: { ...(await audioAuthHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'delete-failed');
}

async function uploadAudioFile() {
  const input = document.getElementById('audioFileInput');
  const button = document.getElementById('audioUploadBtn');
  const file = input?.files?.[0];
  if (!file) { showToast('اختر ملف MP3 أولًا', 'bad'); return; }
  if (!/\.mp3$/i.test(file.name) || file.type !== 'audio/mpeg') {
    showToast('يسمح بملفات MP3 فقط', 'bad'); return;
  }
  if (file.size > 2 * 1024 * 1024) {
    showToast('حجم المقطع يجب ألا يتجاوز 2 ميجابايت', 'bad'); return;
  }
  button.disabled = true;
  button.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جارٍ الرفع';
  const previous = siteAudioSettings;
  try {
    const signed = await requestAudioSignature(file);
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', signed.apiKey);
    form.append('timestamp', String(signed.timestamp));
    form.append('folder', signed.folder);
    form.append('signature', signed.signature);
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/${signed.resourceType}/upload`, { method: 'POST', body: form });
    const uploaded = await uploadResponse.json().catch(() => ({}));
    if (!uploadResponse.ok || !uploaded.secure_url || !uploaded.public_id) throw new Error(uploaded.error?.message || 'upload-failed');
    await db.collection('settings').doc('audio').set({
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      fileName: file.name,
      bytes: file.size,
      duration: Number(uploaded.duration || 0),
      enabled: true,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    if (previous?.publicId && previous.publicId !== uploaded.public_id) {
      await deleteAudioAsset(previous.publicId).catch(() => {});
    }
    showToast('تم رفع المقطع وتفعيله ✅', 'ok');
    await loadSiteAudio();
    switchSettingsTab('audio');
  } catch (error) {
    console.error('audio upload:', error);
    showToast(error.message === 'auth-required' ? 'يجب تسجيل الدخول كمدير' : 'تعذر رفع المقطع الصوتي', 'bad');
  } finally {
    button.disabled = false;
    button.innerHTML = '<i class="fa fa-upload"></i> رفع وتفعيل المقطع';
  }
}

async function toggleSiteAudioEnabled() {
  if (!siteAudioSettings?.url) return;
  const enabled = !siteAudioSettings.enabled;
  await db.collection('settings').doc('audio').update({ enabled }).catch(() => { throw new Error('toggle-failed'); });
  siteAudioSettings = { ...siteAudioSettings, enabled };
  updateAudioButton();
  switchSettingsTab('audio');
  showToast(enabled ? 'تم تفعيل التشغيل الصوتي' : 'تم تعطيل التشغيل الصوتي', 'ok');
}

function deleteSiteAudio() {
  if (!siteAudioSettings?.publicId) return;
  adminConfirm('سيتم حذف المقطع من Cloudinary وإيقافه للمستخدمين. هل تريد المتابعة؟', async () => {
    try {
      await deleteAudioAsset(siteAudioSettings.publicId);
      await db.collection('settings').doc('audio').delete();
      if (siteAudio) { siteAudio.pause(); siteAudio = null; }
      siteAudioSettings = null;
      updateAudioButton();
      switchSettingsTab('audio');
      showToast('تم حذف المقطع الصوتي', 'ok');
    } catch (error) {
      console.error('audio delete:', error);
      showToast('تعذر حذف المقطع الصوتي', 'bad');
    }
  });
}

function renderAudioSettings(ct) {
  const d = siteAudioSettings || {};
  ct.innerHTML = `
    <div class="section-label">🎵 المقاطع الصوتية</div>
    <p style="font-size:.8em;color:var(--gray);line-height:1.6;margin-bottom:10px">ارفع مقطع MP3 بحجم أقصى 2 ميجابايت. بعد تفعيله ينتظر الموقع أول لمسة من الزائر ثم يبدأ التشغيل، ويمكن للزائر إيقافه من زر الصوت العلوي.</p>
    <div class="fg"><label for="audioFileInput">ملف MP3</label><input id="audioFileInput" type="file" accept="audio/mpeg,.mp3" style="padding:8px"></div>
    <button class="btn btn-blue btn-sm" id="audioUploadBtn" type="button" onclick="uploadAudioFile()"><i class="fa fa-upload"></i> رفع وتفعيل المقطع</button>
    ${d.url ? `<div class="dash-card" style="margin-top:14px;padding:12px">
      <div style="font-weight:800;font-size:.9em">${audioEscape(d.fileName || 'مقطع صوتي')}</div>
      <div style="font-size:.74em;color:var(--gray);margin:4px 0 8px">${Math.round(Number(d.bytes || 0)/1024)} KB ${d.enabled ? '— مفعّل' : '— متوقف'}</div>
      <audio controls preload="none" src="${audioEscape(d.url)}" style="width:100%;margin-bottom:8px"></audio>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn ${d.enabled ? 'btn-orange' : 'btn-green'} btn-sm" onclick="toggleSiteAudioEnabled()"><i class="fa ${d.enabled ? 'fa-volume-mute' : 'fa-volume-up'}"></i> ${d.enabled ? 'تعطيل التشغيل' : 'تفعيل التشغيل'}</button>
        <button class="btn btn-red btn-sm" onclick="deleteSiteAudio()"><i class="fa fa-trash"></i> حذف المقطع</button>
      </div>
    </div>` : `<div class="empty-state" style="padding:24px 10px"><i class="fa fa-music"></i><p>لا يوجد مقطع صوتي مرفوع</p></div>`}`;
  const upload = document.getElementById('audioUploadBtn');
  if (upload) upload.onclick = uploadAudioFile;
}

window.addEventListener('DOMContentLoaded', loadSiteAudio);
