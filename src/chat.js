/* ============================================================
   chat.js
   Buyer <-> seller private messaging (chat list + chat window).
   ============================================================ */

function openMessages() {
  if (!currentUser) { openModal('authModal'); showToast('سجل دخولك للوصول للرسائل', 'bad'); return; }
  document.getElementById('msgTitle').textContent = 'الرسائل';
  document.getElementById('msgContent').innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openModal('msgModal');
  db.collection('chats').where('participants', 'array-contains', currentUser.uid)
    .orderBy('lastMessageAt', 'desc').get()
    .then(snap => {
      if (snap.empty) { document.getElementById('msgContent').innerHTML = '<div class="empty-state"><i class="fa fa-comment-slash"></i><p>لا توجد محادثات بعد</p></div>'; return; }
      const rows = snap.docs.map(d => {
        const data = d.data();
        const otherId = (data.participants || []).find(p => p !== currentUser.uid) || '';
        const names = data.participantNames || {};
        const otherName = names[otherId] || 'مستخدم';
        return `<div class="chat-row" onclick="openChat('${d.id}','${otherId}','${otherName}','${(data.adTitle || '').replace(/'/g, '')}')">
          <div class="chat-avatar">${otherName.charAt(0).toUpperCase()}</div>
          <div class="chat-info">
            <div class="chat-name">${otherName}</div>
            <div class="chat-msg">${data.lastMessage || 'ابدأ المحادثة'}</div>
            <div class="chat-msg" style="font-size:.68em;margin-top:2px">${data.adTitle || ''}</div>
          </div>
        </div>`;
      });
      document.getElementById('msgContent').innerHTML = '<div class="chat-list">' + rows.join('') + '</div>';
    }).catch(() => { document.getElementById('msgContent').innerHTML = '<div class="empty-state"><i class="fa fa-comment-slash"></i><p>لا توجد محادثات</p></div>'; });
}

function startChat(adId, sellerId, adTitle) {
  if (!currentUser) { openModal('authModal'); return; }
  if (currentUser.uid === sellerId) { showToast('لا يمكنك مراسلة نفسك', 'bad'); return; }
  closeModal('detailModal');
  const chatId = [currentUser.uid, sellerId].sort().join('_') + '_' + adId;
  openChat(chatId, sellerId, 'البائع', adTitle);
}

function openChat(chatId, otherId, otherName, adTitle) {
  document.getElementById('msgTitle').textContent = otherName;
  const content = document.getElementById('msgContent');
  content.innerHTML = `
    <div style="font-size:.75em;color:var(--gray);margin-bottom:10px;padding:6px 10px;background:var(--bg);border-radius:8px"><i class="fa fa-tag"></i> ${adTitle}</div>
    <div class="chat-window">
      <div class="chat-msgs" id="chatMsgs"><div style="text-align:center;color:var(--gray);padding:20px"><i class="fa fa-spinner fa-spin"></i></div></div>
      <div class="chat-input-bar">
        <input type="text" id="chatInput" placeholder="اكتب رسالة..." onkeydown="if(event.key==='Enter')sendMsg('${chatId}','${otherId}')">
        <button class="send-btn" onclick="sendMsg('${chatId}','${otherId}')"><i class="fa fa-paper-plane"></i></button>
      </div>
    </div>`;
  const chatRef = db.collection('chats').doc(chatId);
  chatRef.set({
    participants: [currentUser.uid, otherId],
    participantNames: { [currentUser.uid]: currentUser.displayName || currentUser.email || 'مستخدم', [otherId]: otherName },
    adTitle: adTitle, lastMessage: '', lastMessageAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
  if (chatUnsub) chatUnsub();
  chatUnsub = chatRef.collection('messages').orderBy('createdAt').onSnapshot(snap => {
    const el = document.getElementById('chatMsgs'); if (!el) return;
    el.innerHTML = snap.empty ? '<div style="text-align:center;color:var(--gray);padding:30px;font-size:.85em">ابدأ المحادثة 👋</div>' :
      snap.docs.map(d => {
        const m = d.data(); const mine = m.senderId === currentUser.uid;
        return `<div class="msg-bubble ${mine ? 'mine' : 'theirs'}">${m.text}<div class="msg-time">${timeAgo(m.createdAt)}</div></div>`;
      }).join('');
    el.scrollTop = el.scrollHeight;
  });
}

async function sendMsg(chatId, otherId) {
  const input = document.getElementById('chatInput');
  const text = (input.value || '').trim(); if (!text) return;
  input.value = '';
  const chatRef = db.collection('chats').doc(chatId);
  try {
    await chatRef.collection('messages').add({ text, senderId: currentUser.uid, senderName: currentUser.displayName || 'مستخدم', createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    await chatRef.update({ lastMessage: text, lastMessageAt: firebase.firestore.FieldValue.serverTimestamp() });
  } catch (e) { showToast('خطأ في إرسال الرسالة', 'bad'); }
}
