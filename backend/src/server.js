const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { requireAuth } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', require('./routes-auth'));
app.use('/api/ads', require('./routes-ads').router);
app.use('/api/chats', require('./routes-chat'));
app.use('/api/admin', require('./routes-admin'));

app.get('/api/settings', (req, res) => {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'contact'").get();
  res.json({ settings: row ? JSON.parse(row.value) : {} });
});

app.post('/api/visit', (req, res) => {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'stats'").get();
  const stats = row ? JSON.parse(row.value) : { visits: 0 };
  stats.visits = (stats.visits || 0) + 1;
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('stats', ?)").run(JSON.stringify(stats));
  res.json({ ok: true, visits: stats.visits });
});

app.get('/api/stats', (req, res) => {
  const users = db.prepare("SELECT COUNT(*) c FROM users WHERE role = 'user'").get().c;
  const ads = db.prepare("SELECT COUNT(*) c FROM ads WHERE status != 'deleted'").get().c;
  const visitsRow = db.prepare("SELECT value FROM settings WHERE key = 'stats'").get();
  res.json({ users, ads, visits: visitsRow ? (JSON.parse(visitsRow.value).visits || 0) : 0 });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  if (err && err.message === 'نوع الملف غير مدعوم') {
    return res.status(400).json({ error: err.message });
  }
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'حجم الملف يتجاوز الحد المسموح' });
  }
  res.status(500).json({ error: 'خطأ في الخادم' });
});

app.listen(PORT, () => {
  console.log(`Souq backend running on http://localhost:${PORT}`);
});
