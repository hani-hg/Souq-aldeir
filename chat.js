// src/js/chat.js
import { db } from './firebase.js';
import { showToast, timeAgo, openModal, closeModal } from '../components/modal.js';
import { getCurrentUser } from './auth.js';

let chatUnsub = null;

export function openMessages() {
  const currentUser = getCurrentUser();
  if (!currentUser) { openModal('authModal'); showToast('سجل دخولك للوصول للرسائل', 'bad'); return; }
  const title = document.getElementById('msgTitle');
  const content = document.getElementById('msgContent');
  if (!title || !content) return;
  title.textContent = 'الرسائل';
  content.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openModal('msgModal');
  db.collection('chats').where('participants', 'array-contains', currentUser.uid)
    .orderBy('lastMessageAt', 'desc').get()
    .then(snap => {
      if (snap.empty) { content.innerHTML = '<div class="empty-state"><i class="fa fa-comment-slash"></i><p>لا توجد محادثات بعد</p></div>'; return; }
      const rows = snap.docs.map(d => {
        const data = d.data();
        const otherId = (data.participants || []).find(p => p !== currentUser.uid) || '';
        const names = data.participantNames || {};
        const otherName = names[otherId] || 'مستخدم';
        return `<div class="chat-row" onclick="window.openChat('${d.id}','${otherId}','${otherName}','${(data.adTitle || '').replace(/'/g, '')}')">
          <div class="chat-avatar">${otherName.charAt(0).toUpperCase()}</div>
          <div class="chat-info">
            <div class="chat-name">${otherName}</div>
            <div class="chat-msg">${data.lastMessage || 'ابدأ المحادثة'}</div>
            <div class="chat-msg" style="font-size:.68em;margin-top:2px">${data.adTitle || ''}</div>
          </div>
        </div>`;
      });
      content.innerHTML = '<div class="chat-list">' + rows.join('') + '</div>';
    }).catch(() => { content.innerHTML = '<div class="empty-state"><i class="fa fa-comment-slash"></i><p>لا توجد محادثات</p></div>'; });
}

export function startChat(adId, sellerId, adTitle) {
  const currentUser = getCurrentUser();
  if (!currentUser) { openModal('authModal'); return; }
  if (currentUser.uid === sellerId) { showToast('لا يمكنك مراسلة نفسك', 'bad'); return; }
  closeModal('detailModal');
  const chatId = [currentUser.uid, sellerId].sort().join('_') + '_' + adId;
  openChat(chatId, sellerId, 'البائع', adTitle);
}

export function openChat(chatId, otherId, otherName, adTitle) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  const title = document.getElementById('msgTitle');
  const content = document.getElementById('msgContent');
  if (!title || !content) return;
  title.textContent = otherName;
  content.innerHTML = `
    <div style="font-size:.75em;color:var(--gray);margin-bottom:10px;padding:6px 10px;background:var(--bg);border-radius:8px"><i class="fa fa-tag"></i> ${adTitle}</div>
    <div class="chat-window">
      <div class="chat-msgs" id="chatMsgs"><div style="text-align:center;color:var(--gray);padding:20px"><i class="fa fa-spinner fa-spin"></i></div></div>
      <div class="chat-input-bar">
        <input type="text" id="chatInput" placeholder="اكتب رسالة..." onkeydown="if(event.key==='Enter')window.sendMsg('${chatId}','${otherId}')">
        <button class="send-btn" onclick="window.sendMsg('${chatId}','${otherId}')"><i class="fa fa-paper-plane"></i></button>
      </div>
    </div>`;
  const chatRef = db.collection('chats').doc(chatId);
  chatRef.set({
    participants: [currentUser.uid, otherId],
    participantNames: {
      [currentUser.uid]: currentUser.displayName || currentUser.email || 'مستخدم',
      [otherId]: otherName
    },
    adTitle: adTitle,
    lastMessage: '',
    lastMessageAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
  if (chatUnsub) chatUnsub();
  chatUnsub = chatRef.collection('messages').orderBy('createdAt').onSnapshot(snap => {
    const el = document.getElementById('chatMsgs');
    if (!el) return;
    el.innerHTML = snap.empty ? '<div style="text-align:center;color:var(--gray);padding:30px;font-size:.85em">ابدأ المحادثة 👋</div>' :
      snap.docs.map(d => {
        const m = d.data();
        const mine = m.senderId === currentUser.uid;
        return `<div class="msg-bubble ${mine ? 'mine' : 'theirs'}">${m.text}<div class="msg-time">${timeAgo(m.createdAt)}</div></div>`;
      }).join('');
    el.scrollTop = el.scrollHeight;
  });
  window.chatUnsub = chatUnsub;
}

export async function sendMsg(chatId, otherId) {
  const input = document.getElementById('chatInput');
  const text = (input?.value || '').trim();
  if (!text) return;
  input.value = '';
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  const chatRef = db.collection('chats').doc(chatId);
  try {
    await chatRef.collection('messages').add({
      text,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'مستخدم',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await chatRef.update({ lastMessage: text, lastMessageAt: firebase.firestore.FieldValue.serverTimestamp() });
  } catch (e) { showToast('خطأ في إرسال الرسالة', 'bad'); }
}

// جعل الدوال عامة
window.openMessages = openMessages;
window.startChat = startChat;
window.openChat = openChat;
window.sendMsg = sendMsg;