const express = require('express');
const db = require('./db');
const { requireAuth } = require('./auth');

const router = express.Router();

function chatId(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function serializeMessage(m) {
  return { id: m.id, chatId: m.chatId, senderId: m.senderId, receiverId: m.receiverId, text: m.text, read: !!m.read, createdAt: m.createdAt };
}

function serializeChat(row, meId, partnerId) {
  const partner = db.prepare('SELECT id, name, phone, avatar, isBanned FROM users WHERE id = ?').get(partnerId);
  return {
    partner: partner ? { id: partner.id, name: partner.name, phone: partner.phone, avatar: partner.avatar } : null,
    lastMessage: row.lastText,
    lastAt: row.lastAt,
    unread: row.unread
  };
}

router.get('/', requireAuth, (req, res) => {
  const meId = req.user.id;
  const rows = db.prepare(`
    SELECT m.chatId,
           MAX(m.createdAt) AS lastAt,
           (SELECT text FROM messages WHERE chatId = m.chatId ORDER BY createdAt DESC LIMIT 1) AS lastText,
           (SELECT COUNT(*) FROM messages WHERE chatId = m.chatId AND receiverId = ? AND read = 0) AS unread
    FROM messages m
    WHERE m.senderId = ? OR m.receiverId = ?
    GROUP BY m.chatId
    ORDER BY lastAt DESC
  `).all(meId, meId, meId);

  const chats = rows.map(r => {
    const ids = r.chatId.split('-').map(Number);
    const partnerId = ids[0] === meId ? ids[1] : ids[0];
    return serializeChat(r, meId, partnerId);
  }).filter(c => c.partner && !c.partner.isBanned);

  const totalUnread = rows.reduce((s, r) => s + r.unread, 0);
  res.json({ chats, totalUnread });
});

router.get('/:userId', requireAuth, (req, res) => {
  const meId = req.user.id;
  const partnerId = Number(req.params.userId);
  if (partnerId === meId) return res.status(400).json({ error: 'لا يمكن المراسلة مع نفسك' });
  const partner = db.prepare('SELECT id, name, phone, avatar FROM users WHERE id = ?').get(partnerId);
  if (!partner) return res.status(404).json({ error: 'المستخدم غير موجود' });

  const cid = chatId(meId, partnerId);
  const messages = db.prepare(
    'SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt ASC LIMIT 200'
  ).all(cid).map(serializeMessage);

  db.prepare('UPDATE messages SET read = 1 WHERE chatId = ? AND receiverId = ?').run(cid, meId);

  res.json({ partner: { id: partner.id, name: partner.name, phone: partner.phone, avatar: partner.avatar }, messages });
});

router.post('/:userId', requireAuth, (req, res) => {
  const meId = req.user.id;
  const partnerId = Number(req.params.userId);
  const text = String((req.body && req.body.text) || '').trim();
  if (!text) return res.status(400).json({ error: 'اكتب نص الرسالة' });
  if (partnerId === meId) return res.status(400).json({ error: 'لا يمكن المراسلة مع نفسك' });
  const partner = db.prepare('SELECT id, isBanned FROM users WHERE id = ?').get(partnerId);
  if (!partner || partner.isBanned) return res.status(404).json({ error: 'المستخدم غير موجود' });

  const cid = chatId(meId, partnerId);
  const result = db.prepare(
    'INSERT INTO messages (chatId, senderId, receiverId, text, read, createdAt) VALUES (?,?,?,?,0,?)'
  ).run(cid, meId, partnerId, text, Date.now());

  const m = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ message: serializeMessage(m) });
});

router.get('/:userId/meta', requireAuth, (req, res) => {
  const meId = req.user.id;
  const partnerId = Number(req.params.userId);
  const cid = chatId(meId, partnerId);
  const unread = db.prepare('SELECT COUNT(*) c FROM messages WHERE chatId = ? AND receiverId = ? AND read = 0').get(cid, meId).c;
  res.json({ unread });
});

module.exports = router;
