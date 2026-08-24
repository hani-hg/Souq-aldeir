const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const { requireAuth } = require('./auth');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const CATEGORIES = [
  'سيارات ومركبات', 'عقارات', 'موبايل وأجهزة لوحية', 'إلكترونيات وأجهزة',
  'أجهزة منزلية', 'أثاث وديكور', 'ملابس وأزياء', 'أطفال ورضّع',
  'حيوانات أليفة', 'مواد غذائية ومحاصيل', 'أدوات ومعدات', 'رياضة وترفيه',
  'كتب وأدوات تعليمية', 'وظائف', 'خدمات', 'أخرى'
];

const AREAS = [
  'دير الزور - المدينة', 'البوكمال', 'الميادين', 'الموحسن', 'عشارة', 'الشحيل',
  'الكسرة', 'الجلاء', 'هجين', 'الصور', 'مركدة', 'خشام', 'ذيبان', 'طيبة الإمام',
  'الصالحية', 'حطلة', 'البصيرة', 'التبني', 'الجنينة', 'الكسرة الفوقاني',
  'غرانيج', 'السبخة', 'صبيخان', 'قرية/منطقة أخرى'
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ok = /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype) || /^video\/(mp4|webm|quicktime)$/.test(file.mimetype);
  cb(ok ? null : new Error('نوع الملف غير مدعوم'), ok);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024, files: 6 }
});

function isExpired(ad) {
  return ad.status !== 'sold' && ad.expiresAt < Date.now();
}

function serializeAd(row, viewerId) {
  if (!row) return null;
  let fav = false;
  if (viewerId) {
    fav = !!db.prepare('SELECT 1 FROM favorites WHERE userId = ? AND adId = ?').get(viewerId, row.id);
  }
  const seller = db.prepare('SELECT id, name, phone, avatar, createdAt, isBanned FROM users WHERE id = ?').get(row.userId);
  let images = [];
  try { images = JSON.parse(row.images || '[]'); } catch (e) {}
  const expired = isExpired(row);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    currency: row.currency,
    phone: row.phone,
    category: row.category,
    area: row.area,
    customArea: row.customArea,
    durationDays: row.durationDays,
    status: expired ? 'expired' : row.status,
    featured: !!row.featured,
    images,
    video: row.video,
    views: row.views,
    createdAt: row.createdAt,
    expiresAt: row.expiresAt,
    isFavorite: fav,
    seller
  };
}

router.get('/categories', (req, res) => res.json(CATEGORIES));
router.get('/areas', (req, res) => res.json(AREAS));

router.get('/', (req, res) => {
  const { search, cat, area, min, max, sort, onlyFav, userId, limit = 30, offset = 0 } = req.query;
  const where = ["status != 'deleted' AND expiresAt > ?"];
  const params = [Date.now()];

  if (search) {
    where.push('(title LIKE ? OR description LIKE ?)');
    const s = `%${search}%`;
    params.push(s, s);
  }
  if (cat) { where.push('category = ?'); params.push(cat); }
  if (area) { where.push('(area = ? OR customArea = ?)'); params.push(area, area); }
  if (min !== undefined && min !== '') { where.push('price >= ?'); params.push(Number(min)); }
  if (max !== undefined && max !== '') { where.push('price <= ?'); params.push(Number(max)); }
  if (onlyFav === '1') {
    where.push('id IN (SELECT adId FROM favorites WHERE userId = ?)');
    params.push(Number(userId || 0));
  }
  if (userId) { where.push('userId = ?'); params.push(Number(userId)); }

  const orderMap = {
    newest: 'createdAt DESC',
    price_asc: 'price ASC',
    price_desc: 'price DESC',
    views: 'views DESC'
  };
  const order = orderMap[sort] || orderMap.newest;

  const total = db.prepare(`SELECT COUNT(*) c FROM ads WHERE ${where.join(' AND ')}`).get(...params).c;
  const rows = db.prepare(
    `SELECT * FROM ads WHERE ${where.join(' AND ')} ORDER BY featured DESC, ${order} LIMIT ? OFFSET ?`
  ).all(...params, Number(limit), Number(offset));

  res.json({ total, ads: rows.map(r => serializeAd(r, req.user && req.user.id)) });
});

router.get('/featured', (req, res) => {
  const rows = db.prepare(
    "SELECT * FROM ads WHERE featured = 1 AND status != 'deleted' AND expiresAt > ? ORDER BY createdAt DESC LIMIT 8"
  ).all(Date.now());
  res.json({ ads: rows.map(r => serializeAd(r, req.user && req.user.id)) });
});

router.get('/my', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM ads WHERE userId = ? AND status != ? ORDER BY createdAt DESC').all(req.user.id, 'deleted');
  res.json({ ads: rows.map(r => serializeAd(r, req.user.id)) });
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(Number(req.params.id));
  if (!row || row.status === 'deleted') return res.status(404).json({ error: 'الإعلان غير موجود' });
  db.prepare('UPDATE ads SET views = views + 1 WHERE id = ?').run(row.id);
  res.json({ ad: serializeAd(row, req.user && req.user.id) });
});

router.post('/', requireAuth, upload.array('images', 5), (req, res) => {
  const { title, description, price, currency, phone, category, area, customArea, durationDays, video } = req.body || {};
  if (!title || !title.trim()) return res.status(400).json({ error: 'عنوان الإعلان مطلوب' });
  if (!description || !description.trim()) return res.status(400).json({ error: 'وصف الإعلان مطلوب' });
  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum < 0) return res.status(400).json({ error: 'السعر غير صالح' });
  if (!phone) return res.status(400).json({ error: 'رقم الهاتف مطلوب' });
  if (!category) return res.status(400).json({ error: 'الفئة مطلوبة' });
  if (!area) return res.status(400).json({ error: 'المنطقة مطلوبة' });

  const images = (req.files || []).filter(f => f.mimetype.startsWith('image/')).map(f => `/uploads/${f.filename}`);
  const vidFile = (req.files || []).find(f => f.mimetype.startsWith('video/'));
  const vidUrl = video || (vidFile ? `/uploads/${vidFile.filename}` : null);

  const duration = [30, 60, 90, 180, 365].includes(Number(durationDays)) ? Number(durationDays) : 30;
  const now = Date.now();

  const result = db.prepare(`
    INSERT INTO ads (title, description, price, currency, phone, category, area, customArea, durationDays, images, video, userId, createdAt, expiresAt)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(title.trim(), description.trim(), priceNum, currency === 'SYP' ? 'SYP' : 'USD', String(phone).trim(),
    category, area, customArea || null, duration, JSON.stringify(images), vidUrl, req.user.id, now, now + duration * 86400000);

  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ad: serializeAd(row, req.user.id) });
});

router.put('/:id', requireAuth, upload.array('images', 5), (req, res) => {
  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(Number(req.params.id));
  if (!row || row.status === 'deleted') return res.status(404).json({ error: 'الإعلان غير موجود' });
  if (row.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'لا تملك صلاحية تعديل هذا الإعلان' });

  const { title, description, price, currency, category, phone, area, customArea, keepImages } = req.body || {};
  let images = [];
  try { images = keepImages ? JSON.parse(keepImages) : []; } catch (e) {}
  const newImages = (req.files || []).filter(f => f.mimetype.startsWith('image/')).map(f => `/uploads/${f.filename}`);
  images = images.slice(0, 5).concat(newImages).slice(0, 5);

  db.prepare(`
    UPDATE ads SET title=?, description=?, price=?, currency=?, category=?, phone=?, area=?, customArea=?, images=?
    WHERE id=?
  `).run(
    title?.trim() || row.title,
    description?.trim() || row.description,
    price !== undefined ? Number(price) : row.price,
    currency === 'SYP' ? 'SYP' : 'USD',
    category || row.category,
    phone || row.phone,
    area || row.area,
    customArea || row.customArea,
    JSON.stringify(images),
    row.id
  );

  const updated = db.prepare('SELECT * FROM ads WHERE id = ?').get(row.id);
  res.json({ ad: serializeAd(updated, req.user.id) });
});

router.delete('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'الإعلان غير موجود' });
  if (row.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'غير مصرح' });
  db.prepare("UPDATE ads SET status = 'deleted' WHERE id = ?").run(row.id);
  res.json({ ok: true });
});

router.post('/:id/sold', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'الإعلان غير موجود' });
  if (row.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'غير مصرح' });
  const newStatus = row.status === 'sold' ? 'active' : 'sold';
  db.prepare('UPDATE ads SET status = ? WHERE id = ?').run(newStatus, row.id);
  res.json({ ok: true, status: newStatus });
});

router.post('/:id/renew', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'الإعلان غير موجود' });
  if (row.userId !== req.user.id) return res.status(403).json({ error: 'غير مصرح' });
  const now = Date.now();
  db.prepare('UPDATE ads SET expiresAt = ?, status = ? WHERE id = ?').run(now + row.durationDays * 86400000, 'active', row.id);
  res.json({ ok: true });
});

router.post('/:id/report', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'الإعلان غير موجود' });
  db.prepare('INSERT INTO reports (adId, reporterId, reason, createdAt) VALUES (?,?,?,?)')
    .run(row.id, req.user.id, (req.body && req.body.reason) || null, Date.now());
  res.json({ ok: true });
});

router.post('/:id/favorite', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'الإعلان غير موجود' });
  const exists = db.prepare('SELECT 1 FROM favorites WHERE userId = ? AND adId = ?').get(req.user.id, row.id);
  if (exists) {
    db.prepare('DELETE FROM favorites WHERE userId = ? AND adId = ?').run(req.user.id, row.id);
    res.json({ ok: true, isFavorite: false });
  } else {
    db.prepare('INSERT INTO favorites (userId, adId, createdAt) VALUES (?,?,?)').run(req.user.id, row.id, Date.now());
    res.json({ ok: true, isFavorite: true });
  }
});

router.get('/:id/contacts', (req, res) => {
  const row = db.prepare('SELECT * FROM ads WHERE id = ?').get(Number(req.params.id));
  if (!row || row.status === 'deleted') return res.status(404).json({ error: 'الإعلان غير موجود' });
  const owner = db.prepare('SELECT id, name FROM users WHERE id = ?').get(row.userId);
  res.json({ adPhone: row.phone, owner });
});

module.exports = { router, CATEGORIES, AREAS, serializeAd };
