const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db');
const { signToken, requireAuth } = require('./auth');

const router = express.Router();

function publicUser(u) {
  if (!u) return null;
  return { id: u.id, name: u.name, phone: u.phone, email: u.email, role: u.role, avatar: u.avatar, createdAt: u.createdAt };
}

router.post('/register', (req, res) => {
  const { name, phone, email, password } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ error: 'الاسم الكامل مطلوب' });
  const phoneClean = String(phone || '').replace(/[^0-9+]/g, '');
  if (!phoneClean) return res.status(400).json({ error: 'رقم الهاتف مطلوب' });
  if (!password || password.length < 6) return res.status(400).json({ error: 'كلمة المرور 6 أحرف على الأقل' });

  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phoneClean);
  if (existing) return res.status(409).json({ error: 'رقم الهاتف مسجل مسبقاً' });

  const hash = bcrypt.hashSync(password, 10);
  const emailVal = email && email.trim() ? email.trim().toLowerCase() : null;
  if (emailVal) {
    const dup = db.prepare('SELECT id FROM users WHERE email = ?').get(emailVal);
    if (dup) return res.status(409).json({ error: 'البريد الإلكتروني مستخدم من قبل' });
  }

  const result = db.prepare(
    'INSERT INTO users (name, phone, email, password, role, createdAt) VALUES (?,?,?,?,?,?)'
  ).run(name.trim(), phoneClean, emailVal, hash, 'user', Date.now());

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const { identifier, password } = req.body || {};
  if (!identifier || !password) return res.status(400).json({ error: 'أدخل رقم الهاتف/البريد وكلمة المرور' });
  const idClean = String(identifier).trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE phone = ? OR email = ?').get(idClean.replace(/[^0-9+]/g, ''), idClean);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
  }
  if (user.isBanned) return res.status(403).json({ error: 'تم حظر حسابك، تواصل مع الإدارة' });
  res.json({ token: signToken(user), user: publicUser(user) });
});

router.post('/reset', (req, res) => {
  const { phone } = req.body || {};
  const phoneClean = String(phone || '').replace(/[^0-9+]/g, '');
  if (!phoneClean) return res.status(400).json({ error: 'رقم الهاتف مطلوب' });
  const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phoneClean);
  if (!user) return res.status(404).json({ error: 'لا يوجد حساب بهذا الرقم' });
  const hasEmail = !!(user.email && user.email.includes('@'));
  if (hasEmail) {
    const tmp = Math.random().toString(36).slice(2, 8);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(bcrypt.hashSync(tmp, 10), user.id);
    return res.json({ ok: true, tempPassword: tmp, note: 'نظراً لعدم توفر خدمة إرسال بريد مجانية، استخدم كلمة المرور المؤقتة التالية ثم غيّرها من حسابك. تأكد من حذف هذه الرسالة.' });
  }
  const settings = JSON.parse(db.prepare("SELECT value FROM settings WHERE key = 'contact'").get().value);
  return res.json({ ok: true, contact: settings, note: 'حسابك غير مرتبط ببريد إلكتروني حقيقي. تواصل مع الإدارة لتغيير كلمة المرور.' });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.put('/me', requireAuth, (req, res) => {
  const { name, email } = req.body || {};
  const updates = [];
  const params = [];
  if (name && name.trim()) { updates.push('name = ?'); params.push(name.trim()); }
  if (email !== undefined) {
    const em = email && email.trim() ? email.trim().toLowerCase() : null;
    if (em) {
      const dup = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(em, req.user.id);
      if (dup) return res.status(409).json({ error: 'البريد الإلكتروني مستخدم من قبل' });
    }
    updates.push('email = ?'); params.push(em);
  }
  if (updates.length) {
    params.push(req.user.id);
    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  res.json({ user: publicUser(user) });
});

router.put('/password', requireAuth, (req, res) => {
  const { current, password } = req.body || {};
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!current || !bcrypt.compareSync(current, user.password)) {
    return res.status(400).json({ error: 'كلمة المرور الحالية غير صحيحة' });
  }
  if (!password || password.length < 6) return res.status(400).json({ error: 'كلمة المرور 6 أحرف على الأقل' });
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), user.id);
  res.json({ ok: true });
});

module.exports = router;
