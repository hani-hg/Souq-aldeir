const jwt = require('jsonwebtoken');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'souq-aldeir-secret-key-change-me';

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'غير مسجل الدخول' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, name, phone, email, role, isBanned, avatar, createdAt FROM users WHERE id = ?').get(payload.id);
    if (!user) return res.status(401).json({ error: 'المستخدم غير موجود' });
    if (user.isBanned) return res.status(403).json({ error: 'تم حظر حسابك، تواصل مع الإدارة' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'انتهت الجلسة، سجل الدخول مجدداً' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'غير مصرح لك' });
  }
  next();
}

module.exports = { signToken, requireAuth, requireAdmin };
