/* ============================================================
   CHAT
   المراسلة بين المشتري والبائع داخل الموقع
============================================================ */

let chatUnsub = null;

function openMsgs() {
  if (!CU) { openM('authModal'); toast('سجل دخولك للوصول للرسائل', 'bad'); return; }
  document.getElementById('msgTitle').textContent = 'الرسائل';
  document.getElementById('msgBody').innerHTML = '<div class="loading-state"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openM('msgModal');

  db.collection('chats').where('participants', 'array-contains', CU.uid).orderBy('lastMessageAt', 'desc').get()
    .then(snap => {
      if (snap.empty) {
        document.getElementById('msgBody').innerHTML = '<div class="empty-state"><i class="fa fa-comment-slash"></i><p>لا توجد محادثات بعد</p></div>';
        return;
      }
      document.getElementById('msgBody').innerHTML = '<div>' + snap.docs.map(d => {
        const data = d.data();
        const otherId = (data.participants || []).find(p => p !== CU.uid) || '';
        const names = data.participantNames || {};
        const otherName = names[otherId] || 'مستخدم';
        return `<div class="chatrow" onclick="openChat('${d.id}','${otherId}','${otherName}','${(data.adTitle || '').replace(/'/g, '')}')">
          <div class="chatav">${otherName.charAt(0).toUpperCase()}</div>
          <div class="chatinfo">
            <div class="chatname">${otherName}</div>
            <div class="chatmsg">${data.lastMessage || 'ابدأ المحادثة'}</div>
            <div class="chatmsg" style="font-size:.68em;margin-top:2px;color:#bbc">${data.adTitle || ''}</div>
          </div></div>`;
      }).join('') + '</div>';
    })
    .catch(() => {
      document.getElementById('msgBody').innerHTML = '<div class="empty-state"><i class="fa fa-comment-slash"></i><p>لا توجد محادثات</p></div>';
    });
}

function startChat(adId, sellerId, adTitle, sellerName) {
  if (!CU) { openM('authModal'); return; }
  if (CU.uid === sellerId) { toast('لا يمكنك مراسلة نفسك', 'bad'); return; }
  closeM('detailModal');
  const chatId = [CU.uid, sellerId].sort().join('_') + '_' + adId;
  openChat(chatId, sellerId, sellerName, adTitle);
}

function openChat(chatId, otherId, otherName, adTitle) {
  document.getElementById('msgTitle').textContent = otherName;
  document.getElementById('msgBody').innerHTML = `
    <div style="font-size:.75em;color:var(--gray);margin-bottom:10px;padding:6px 10px;background:var(--bg);border-radius:8px"><i class="fa fa-tag"></i> ${adTitle}</div>
    <div class="chatwin">
      <div class="chatmsgs" id="chatMsgsEl"><div style="text-align:center;color:var(--gray);padding:20px"><i class="fa fa-spinner fa-spin"></i></div></div>
      <div class="chatinputbar">
        <input type="text" id="chatInp" placeholder="اكتب رسالة..." onkeydown="if(event.key==='Enter')sendMsg('${chatId}','${otherId}')">
        <button class="sendbtn" onclick="sendMsg('${chatId}','${otherId}')"><i class="fa fa-paper-plane"></i></button>
      </div></div>`;

  const ref = db.collection('chats').doc(chatId);
  ref.set({
    participants: [CU.uid, otherId],
    participantNames: { [CU.uid]: CU.displayName || CU.email || 'مستخدم', [otherId]: otherName },
    adTitle, lastMessage: '', lastMessageAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  stopChat();
  chatUnsub = ref.collection('messages').orderBy('createdAt').onSnapshot(snap => {
    const el = document.getElementById('chatMsgsEl'); if (!el) return;
    el.innerHTML = snap.empty
      ? '<div style="text-align:center;color:var(--gray);padding:30px;font-size:.85em">ابدأ المحادثة 👋</div>'
      : snap.docs.map(d => {
          const m = d.data(); const mine = m.senderId === CU.uid;
          return `<div class="mbubble ${mine ? 'mine' : 'theirs'}">${m.text}<div class="mtime">${timeAgo(m.createdAt)}</div></div>`;
        }).join('');
    el.scrollTop = el.scrollHeight;
  });
}

async function sendMsg(chatId, otherId) {
  const inp = document.getElementById('chatInp');
  const text = (inp.value || '').trim(); if (!text) return;
  inp.value = '';
  const ref = db.collection('chats').doc(chatId);
  try {
    await ref.collection('messages').add({
      text, senderId: CU.uid, senderName: CU.displayName || 'مستخدم',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await ref.update({ lastMessage: text, lastMessageAt: firebase.firestore.FieldValue.serverTimestamp() });
  } catch (e) { toast('خطأ في إرسال الرسالة', 'bad'); }
}

function stopChat() { if (chatUnsub) { chatUnsub(); chatUnsub = null; } }
