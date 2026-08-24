const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'souq.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  isBanned INTEGER NOT NULL DEFAULT 0,
  avatar TEXT,
  createdAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  phone TEXT NOT NULL,
  category TEXT NOT NULL,
  area TEXT NOT NULL,
  customArea TEXT,
  durationDays INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'active',
  featured INTEGER NOT NULL DEFAULT 0,
  images TEXT DEFAULT '[]',
  video TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  userId INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  expiresAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS favorites (
  userId INTEGER NOT NULL,
  adId INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  PRIMARY KEY (userId, adId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (adId) REFERENCES ads(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chatId TEXT NOT NULL,
  senderId INTEGER NOT NULL,
  receiverId INTEGER NOT NULL,
  text TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  createdAt INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chatId);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adId INTEGER NOT NULL,
  reporterId INTEGER,
  reason TEXT,
  createdAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

function seed() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (count > 0) return;

  const now = Date.now();
  const insertUser = db.prepare(
    'INSERT INTO users (name, phone, email, password, role, createdAt) VALUES (?,?,?,?,?,?)'
  );
  const adminPass = bcrypt.hashSync('admin123', 10);
  insertUser.run('مدير السوق', '0930000000', 'admin@souq.local', adminPass, 'admin', now);

  const demoPass = bcrypt.hashSync('demo123', 10);
  const demo = insertUser.run('بائع تجريبي', '0940000000', null, demoPass, 'user', now).lastInsertRowid;

  const sampleAds = [
    ['سيارة تويوتا كورولا 2018 بحالة ممتازة', 'سيارة نظيفة، مكفونة، بدون حوادث، كاملة المواصفات. للاستفسار الرجاء الاتصال.', 8500, 'USD', '0940000000', 'سيارات ومركبات', 'دير الزور - المدينة', 90, 1, 124, demo, now, now + 90 * 86400000],
    ['شقة للبيع في حي الجورة', 'شقة 120 متر، غرفتين وصالون، موقع ممتاز قريب من كل الخدمات.', 45000, 'USD', '0940000000', 'عقارات', 'دير الزور - المدينة', 120, 1, 98, demo, now, now + 120 * 86400000],
    ['آيفون 13 برو 256 جيجا', 'الجهاز بحالة ممتازة، البطارية 92%، مع الكرتون والوصلات الأصلية.', 420, 'USD', '0940000000', 'موبايل وأجهزة لوحية', 'البوكمال', 30, 0, 210, demo, now, now + 30 * 86400000],
    ['غسالة أوتوماتيك 7 كيلو جديدة', 'غسالة جديدة بالكرتون، ضمان سنتين، توصيل لجميع مناطق المحافظة.', 2500000, 'SYP', '0940000000', 'أجهزة منزلية', 'الميادين', 60, 0, 45, demo, now, now + 60 * 86400000],
    ['أثاث غرفة نوم كامل', 'غرفة نوم كاملة مودرن، بحالة ممتازة، تشمل السرير والخزانة والتسريحة.', 1500, 'USD', '0940000000', 'أثاث وديكور', 'الموحسن', 45, 0, 67, demo, now, now + 45 * 86400000],
    ['محصول قمح موسم 2024', 'كمية كبيرة من القمح الصلب، نوعية ممتازة، للبيع بالجملة والمفرق.', 1800000, 'SYP', '0940000000', 'مواد غذائية ومحاصيل', 'الشحيل', 30, 0, 32, demo, now, now + 30 * 86400000],
    ['مقاولات بناء وتشطيب', 'فريق متكامل لتنفيذ أعمال البناء والتشطيب بجودة عالية وأسعار منافسة.', 0, 'USD', '0940000000', 'خدمات', 'دير الزور - المدينة', 90, 0, 76, demo, now, now + 90 * 86400000],
    ['دراجة هوائية جبلية', 'دراجة بحالة جيدة، جنوط ألمنيوم، مناسبة للاستخدام اليومي.', 150, 'USD', '0940000000', 'رياضة وترفيه', 'هجين', 30, 0, 41, demo, now, now + 30 * 86400000]
  ];
  const insertAdStmt = db.prepare('INSERT INTO ads (title, description, price, currency, phone, category, area, durationDays, featured, views, userId, createdAt, expiresAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
  for (const a of sampleAds) insertAdStmt.run(...a);

  db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('contact', ?)").run(
    JSON.stringify({ email: 'hg78@live.com', phone: '+90 552 274 09 10', whatsapp: '905522740910' })
  );
  db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('stats', ?)").run(
    JSON.stringify({ visits: 0 })
  );
}

seed();

module.exports = db;
