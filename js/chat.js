/* ============================================================
   chat.js
   Buyer <-> seller private messaging (chat list + chat window)
   + a live "unread messages" badge on the messages nav buttons.

   NOTE: the chats-list query intentionally does NOT use
   .orderBy() alongside .where('participants','array-contains',...).
   Combining array-contains with orderBy on a different field
   requires a Firestore *composite index* that must be created
   manually in the Firebase console; until that index exists the
   query silently fails. We avoid that entirely by fetching with
   only the array-contains filter (auto-indexed) and sorting the
   results on the client instead.
   ============================================================ */

function loadChatSeenMap() {
  try { chatSeenMap = JSON.parse(localStorage.getItem('souq_chat_seen') || '{}'); } catch (e) { chatSeenMap = {}; }
}

function markChatSeen(chatId) {
  chatSeenMap[chatId] = Date.now();
  localStorage.setItem('souq_chat_seen', JSON.stringify(chatSeenMap));
  updateMsgBadge();
}

function updateMsgBadge() {
  if (!currentUser) {
    ['msgBadge', 'msgBadgeBottom'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    return;
  }
  const unread = chatsCache.filter(c => {
    if (!c.lastSenderId || c.lastSenderId === currentUser.uid) return false; // no msg yet, or it's my own last message
    const seenAt = chatSeenMap[c.id] || 0;
    const msgAt = (c.lastMessageAt && c.lastMessageAt.toMillis) ? c.lastMessageAt.toMillis() : 0;
    return msgAt > seenAt;
  }).length;
  ['msgBadge', 'msgBadgeBottom'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (unread > 0) { el.style.display = 'flex'; el.textContent = unread > 9 ? '9+' : unread; }
    else { el.style.display = 'none'; }
  });
}

/* Live listener over every chat the signed-in user is part of.
   Powers both the chat list UI and the unread badge. Call once
   after login; unsubscribe on logout. */
function initChatsListener() {
  if (chatsListUnsub) { chatsListUnsub(); chatsListUnsub = null; }
  if (!currentUser) { chatsCache = []; updateMsgBadge(); return; }
  chatsListUnsub = db.collection('chats')
    .where('participants', 'array-contains', currentUser.uid)
    .onSnapshot(snap => {
      chatsCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      chatsCache.sort((a, b) => {
        const ta = (a.lastMessageAt && a.lastMessageAt.toMillis) ? a.lastMessageAt.toMillis() : 0;
        const tb = (b.lastMessageAt && b.lastMessageAt.toMillis) ? b.lastMessageAt.toMillis() : 0;
        return tb - ta;
      });
      updateMsgBadge();
      // if the chat-list view is currently open, refresh it live
      if (document.getElementById('msgModal').classList.contains('active') && document.getElementById('msgTitle').textContent === 'الرسائل') {
        renderChatList();
      }
    }, () => { /* offline / permission errors: badge just stays as last known state */ });
}

function stopChatsListener() {
  if (chatsListUnsub) { chatsListUnsub(); chatsListUnsub = null; }
  chatsCache = [];
  updateMsgBadge();
}

function renderChatList() {
  if (!chatsCache.length) { document.getElementById('msgContent').innerHTML = '<div class="empty-state"><i class="fa fa-comment-slash"></i><p>لا توجد محادثات بعد</p></div>'; return; }
  const rows = chatsCache.map(data => {
    const otherId = (data.participants || []).find(p => p !== currentUser.uid) || '';
    const names = data.participantNames || {};
    const otherName = names[otherId] || 'مستخدم';
    const seenAt = chatSeenMap[data.id] || 0;
    const msgAt = (data.lastMessageAt && data.lastMessageAt.toMillis) ? data.lastMessageAt.toMillis() : 0;
    const isUnread = data.lastSenderId && data.lastSenderId !== currentUser.uid && msgAt > seenAt;
    return `<div class="chat-row" onclick="openChat('${data.id}','${otherId}','${otherName}','${(data.adTitle || '').replace(/'/g, '')}')">
      <div class="chat-avatar">${otherName.charAt(0).toUpperCase()}</div>
      <div class="chat-info">
        <div class="chat-name">${otherName}${isUnread ? ' 🔵' : ''}</div>
        <div class="chat-msg">${data.lastMessage || 'ابدأ المحادثة'}</div>
        <div class="chat-msg" style="font-size:.68em;margin-top:2px">${data.adTitle || ''}</div>
      </div>
    </div>`;
  });
  document.getElementById('msgContent').innerHTML = '<div class="chat-list">' + rows.join('') + '</div>';
}

function openMessages() {
  if (!currentUser) { openModal('authModal'); showToast('سجل دخولك للوصول للرسائل', 'bad'); return; }
  document.getElementById('msgTitle').textContent = 'الرسائل';
  if (!chatsCache.length) {
    document.getElementById('msgContent').innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  }
  openModal('msgModal');
  renderChatList();
}

function startChat(adId, sellerId, adTitle) {
  if (!currentUser) { openModal('authModal'); return; }
  if (currentUser.uid === sellerId) { showToast('لا يمكنك مراسلة نفسك', 'bad'); return; }
  closeModal('detailModal');
  const chatId = [currentUser.uid, sellerId].sort().join('_') + '_' + adId;
  openChat(chatId, sellerId, 'البائع', adTitle);
}

function openChat(chatId, otherId, otherName, adTitle) {
  openModal('msgModal');
  markChatSeen(chatId);
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
    markChatSeen(chatId); // messages arriving while the chat is open count as read
  });
}

async function sendMsg(chatId, otherId) {
  const input = document.getElementById('chatInput');
  const text = (input.value || '').trim(); if (!text) return;
  input.value = '';
  const chatRef = db.collection('chats').doc(chatId);
  try {
    await chatRef.collection('messages').add({ text, senderId: currentUser.uid, senderName: currentUser.displayName || 'مستخدم', createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    await chatRef.update({ lastMessage: text, lastSenderId: currentUser.uid, lastMessageAt: firebase.firestore.FieldValue.serverTimestamp() });
  } catch (e) { showToast('خطأ في إرسال الرسالة', 'bad'); }
}


