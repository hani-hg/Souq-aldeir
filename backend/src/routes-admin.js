const express = require('express');
const db = require('./db');
const { requireAuth, requireAdmin } = require('./auth');
const { serializeAd } = require('./routes-ads');

const router = express.Router();
router.use(requireAuth, requireAdmin);

router.get('/stats', (req, res) => {
  const users = db.prepare("SELECT COUNT(*) c FROM users WHERE role = 'user'").get().c;
  const ads = db.prepare("SELECT COUNT(*) c FROM ads WHERE status != 'deleted'").get().c;
  const activeAds = db.prepare("SELECT COUNT(*) c FROM ads WHERE status = 'active' AND expiresAt > ?").get(Date.now()).c;
  const messages = db.prepare('SELECT COUNT(*) c FROM messages').get().c;
  const reports = db.prepare('SELECT COUNT(*) c FROM reports').get().c;
  const newUsers7 = db.prepare('SELECT COUNT(*) c FROM users WHERE createdAt > ?').get(Date.now() - 7 * 86400000).c;
  const newAds7 = db.prepare("SELECT COUNT(*) c FROM ads WHERE status != 'deleted' AND createdAt > ?").get(Date.now() - 7 * 86400000).c;

  const byCat = db.prepare(
    "SELECT category, COUNT(*) c FROM ads WHERE status != 'deleted' GROUP BY category ORDER BY c DESC LIMIT 12"
  ).all();

  const last14 = [];
  for (let i = 13; i >= 0; i--) {
    const start = new Date(Date.now() - i * 86400000);
    start.setHours(0, 0, 0, 0);
    const end = start.getTime() + 86400000;
    const c = db.prepare("SELECT COUNT(*) c FROM ads WHERE status != 'deleted' AND createdAt BETWEEN ? AND ?").get(start.getTime(), end).c;
    last14.push({ day: `${start.getMonth() + 1}/${start.getDate()}`, count: c });
  }

  res.json({ users, ads, activeAds, messages, reports, newUsers7, newAds7, byCat, last14 });
});

router.get('/ads', (req, res) => {
  const { search, status } = req.query;
  const where = ["status != 'deleted'"];
  const params = [];
  if (search) { where.push('(title LIKE ? OR description LIKE ?)'); const s = `%${search}%`; params.push(s, s); }
  if (status && status !== 'all') { where.push('status = ?'); params.push(status); }
  const rows = db.prepare(`SELECT * FROM ads WHERE ${where.join(' AND ')} ORDER BY createdAt DESC LIMIT 200`).all(...params);
  res.json({ ads: rows.map(r => serializeAd(r)) });
});

router.get('/users', (req, res) => {
  const rows = db.prepare("SELECT id, name, phone, email, role, isBanned, createdAt FROM users ORDER BY createdAt DESC LIMIT 200").all();
  const withCounts = rows.map(u => {
    const adsCount = db.prepare("SELECT COUNT(*) c FROM ads WHERE userId = ? AND status != 'deleted'").get(u.id).c;
    return { ...u, isBanned: !!u.isBanned, adsCount };
  });
  res.json({ users: withCounts });
});

router.get('/reports', (req, res) => {
  const rows = db.prepare(`
    SELECT r.id, r.reason, r.createdAt, r.adId, a.title AS adTitle, u.name AS reporterName
    FROM reports r JOIN ads a ON a.id = r.adId LEFT JOIN users u ON u.id = r.reporterId
    ORDER BY r.createdAt DESC LIMIT 100
  `).all();
  res.json({ reports: rows });
});

router.post('/ads/:id/toggle', (req, res) => {
  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'الإعلان غير موجود' });
  const newStatus = row.status === 'active' ? 'hidden' : 'active';
  db.prepare('UPDATE ads SET status = ? WHERE id = ?').run(newStatus, row.id);
  res.json({ ok: true, status: newStatus });
});

router.post('/ads/:id/feature', (req, res) => {
  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'الإعلان غير موجود' });
  db.prepare('UPDATE ads SET featured = ? WHERE id = ?').run(row.featured ? 0 : 1, row.id);
  res.json({ ok: true, featured: !row.featured });
});

router.delete('/ads/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'الإعلان غير موجود' });
  db.prepare("UPDATE ads SET status = 'deleted' WHERE id = ?").run(row.id);
  res.json({ ok: true });
});

router.delete('/reports/:id', (req, res) => {
  db.prepare('DELETE FROM reports WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

router.post('/users/:id/ban', (req, res) => {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'المستخدم غير موجود' });
  if (row.role === 'admin') return res.status(403).json({ error: 'لا يمكن حظر مدير' });
  db.prepare('UPDATE users SET isBanned = ? WHERE id = ?').run(row.isBanned ? 0 : 1, row.id);
  res.json({ ok: true, isBanned: !row.isBanned });
});

router.get('/settings', (req, res) => {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'contact'").get();
  res.json({ settings: row ? JSON.parse(row.value) : {} });
});

router.put('/settings', (req, res) => {
  const { email, phone, whatsapp } = req.body || {};
  const current = db.prepare("SELECT value FROM settings WHERE key = 'contact'").get();
  const cur = current ? JSON.parse(current.value) : {};
  const next = { email: email || cur.email, phone: phone || cur.phone, whatsapp: whatsapp || cur.whatsapp };
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('contact', ?)").run(JSON.stringify(next));
  res.json({ settings: next });
});

module.exports = router;
