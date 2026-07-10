// chat.js
let chatUnsub = null;
let currentChatAdId = null;

window.openChat = function(ownerId, adId) {
  if (!auth.currentUser) return window.onUserBtn();
  if (auth.currentUser.uid === ownerId) return window.showToast('هذا إعلانك');
  currentChatAdId = adId;
  document.getElementById('msgBody').innerHTML = `<div id="chatMessages" style="max-height:50vh;overflow-y:auto;margin-bottom:12px;"></div><div style="display:flex;gap:8px;"><input type="text" id="chatInput" placeholder="اكتب..." style="flex:1;padding:10px;border:1px solid #ddd;border-radius:30px;"><button onclick="window.sendChatMsg()" style="background:var(--primary);color:#fff;border:none;border-radius:30px;padding:0 20px;">إرسال</button></div>`;
  window.openM('msgModal');
  if (chatUnsub) chatUnsub();
  const chatId = [auth.currentUser.uid, ownerId].sort().join('_') + '_' + adId;
  chatUnsub = db.collection('chats').doc(chatId).collection('messages').orderBy('timestamp', 'asc')
    .onSnapshot(snap => {
      const container = document.getElementById('chatMessages');
      container.innerHTML = '';
      snap.forEach(doc => {
        const msg = doc.data();
        const div = document.createElement('div');
        div.textContent = msg.text;
        div.style.cssText = `padding:8px 14px;border-radius:20px;margin:4px 0;max-width:80%;background:${msg.senderId === auth.currentUser.uid ? '#e67e22' : '#f1f3f5'};color:${msg.senderId === auth.currentUser.uid ? '#fff' : '#333'};align-self:${msg.senderId === auth.currentUser.uid ? 'flex-end' : 'flex-start'};`;
        container.appendChild(div);
      });
      container.scrollTop = container.scrollHeight;
    });
};

window.sendChatMsg = function() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || !currentChatAdId) return;
  const ad = allAds.find(a => a.id === currentChatAdId);
  if (!ad) return;
  const chatId = [auth.currentUser.uid, ad.ownerId].sort().join('_') + '_' + currentChatAdId;
  db.collection('chats').doc(chatId).collection('messages').add({ text, senderId: auth.currentUser.uid, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
  input.value = '';
};

window.stopChat = function() { if (chatUnsub) { chatUnsub(); chatUnsub = null; } };
window.openMsgs = function() { window.showToast('جاري تحميل المحادثات...'); };
