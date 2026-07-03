// ===== js/chat.js — الدردشة =====
import { auth, db } from './firebase.js';
import { collection, doc, setDoc, addDoc, query, orderBy, onSnapshot, updateDoc, getDocs, where } from 'firebase/firestore';
import { toast, openM, closeM } from './app.js';
import { getCurrentUser } from './auth.js';

let chatUnsub = null;

// ===== فتح قائمة الرسائل =====
export function openMsgs() {
  const CU = getCurrentUser();
  if (!CU) { openM('authModal'); toast('سجل دخولك للوصول للرسائل', 'bad'); return; }
  const title = document.getElementById('msgTitle');
  const body = document.getElementById('msgBody');
  if (!title || !body) return;
  title.textContent = 'الرسائل';
  body.innerHTML = '<div class="loading-state"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openM('msgModal');
  getDocs(query(collection(db, 'chats'), where('participants', 'array-contains', CU.uid), orderBy('lastMessageAt', 'desc')))
    .then(snap => {
      if (snap.empty) {
        body.innerHTML = '<div class="empty-state"><i class="fa fa-comment-slash"></i><p>لا توجد محادثات بعد</p></div>';
        return;
      }
      body.innerHTML = '<div>' + snap.docs.map(d => {
        const data = d.data();
        const otherId = (data.participants || []).find(p => p !== CU.uid) || '';
        const names = data.participantNames || {};
        const otherName = names[otherId] || 'مستخدم';
        return `<div class="chatrow" onclick="window.openChat('${d.id}','${otherId}','${otherName}','${(data.adTitle || '').replace(/'/g, '')}')">
          <div class="chatav">${otherName.charAt(0).toUpperCase()}</div>
          <div class="chatinfo">
            <div class="chatname">${otherName}</div>
            <div class="chatmsg">${data.lastMessage || 'ابدأ المحادثة'}</div>
            <div class="chatmsg" style="font-size:.68em;margin-top:2px;color:#bbc">${data.adTitle || ''}</div>
          </div></div>`;
      }).join('') + '</div>';
    })
    .catch(() => {
      body.innerHTML = '<div class="empty-state"><i class="fa fa-comment-slash"></i><p>لا توجد محادثات</p></div>';
    });
}

// ===== بدء محادثة جديدة =====
export function startChat(adId, sellerId, adTitle, sellerName) {
  const CU = getCurrentUser();
  if (!CU) { openM('authModal'); return; }
  if (CU.uid === sellerId) { toast('لا يمكنك مراسلة نفسك', 'bad'); return; }
  closeM('detailModal');
  const chatId = [CU.uid, sellerId].sort().join('_') + '_' + adId;
  openChat(chatId, sellerId, sellerName || 'البائع', adTitle);
}

// ===== فتح نافذة المحادثة =====
export function openChat(chatId, otherId, otherName, adTitle) {
  const CU = getCurrentUser();
  if (!CU) return;
  document.getElementById('msgTitle').textContent = otherName;
  const body = document.getElementById('msgBody');
  if (!body) return;
  body.innerHTML = `
    <div style="font-size:.75em;color:var(--gray);margin-bottom:10px;padding:6px 10px;background:var(--bg);border-radius:8px"><i class="fa fa-tag"></i> ${adTitle}</div>
    <div class="chatwin">
      <div class="chatmsgs" id="chatMsgsEl"><div style="text-align:center;color:var(--gray);padding:20px"><i class="fa fa-spinner fa-spin"></i></div></div>
      <div class="chatinputbar">
        <input type="text" id="chatInp" placeholder="اكتب رسالة..." onkeydown="if(event.key==='Enter')window.sendMsg('${chatId}','${otherId}')">
        <button class="sendbtn" onclick="window.sendMsg('${chatId}','${otherId}')"><i class="fa fa-paper-plane"></i></button>
      </div>
    </div>`;
  const ref = doc(db, 'chats', chatId);
  setDoc(ref, {
    participants: [CU.uid, otherId],
    participantNames: { [CU.uid]: CU.displayName || CU.email || 'مستخدم', [otherId]: otherName },
    adTitle,
    lastMessage: '',
    lastMessageAt: new Date()
  }, { merge: true });
  stopChat();
  chatUnsub = onSnapshot(query(collection(ref, 'messages'), orderBy('createdAt')), snap => {
    const el = document.getElementById('chatMsgsEl');
    if (!el) return;
    el.innerHTML = snap.empty ?
      '<div style="text-align:center;color:var(--gray);padding:30px;font-size:.85em">ابدأ المحادثة 👋</div>' :
      snap.docs.map(d => {
        const m = d.data();
        const mine = m.senderId === CU.uid;
        return `<div class="mbubble ${mine ? 'mine' : 'theirs'}">${m.text}<div class="mtime">${ago(m.createdAt)}</div></div>`;
      }).join('');
    el.scrollTop = el.scrollHeight;
  });
}

// ===== إرسال رسالة =====
export async function sendMsg(chatId, otherId) {
  const inp = document.getElementById('chatInp');
  const text = (inp.value || '').trim();
  if (!text) return;
  inp.value = '';
  const CU = getCurrentUser();
  if (!CU) return;
  const ref = doc(db, 'chats', chatId);
  try {
    await addDoc(collection(ref, 'messages'), {
      text,
      senderId: CU.uid,
      senderName: CU.displayName || 'مستخدم',
      createdAt: new Date()
    });
    await updateDoc(ref, {
      lastMessage: text,
      lastMessageAt: new Date()
    });
  } catch (e) {
    toast('خطأ في إرسال الرسالة', 'bad');
  }
}

// ===== إيقاف الاستماع للمحادثة =====
export function stopChat() {
  if (chatUnsub) {
    chatUnsub();
    chatUnsub = null;
  }
}

function ago(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'الآن';
  if (s < 3600) return Math.floor(s / 60) + ' د';
  if (s < 86400) return Math.floor(s / 3600) + ' س';
  return Math.floor(s / 86400) + ' يوم';
}
