# سوق دير الزور المفتوح

أول سوق إلكتروني مفتوح لمدينة دير الزور — إعلانات مبوّبة (سيارات، عقارات، إلكترونيات...)
مبني بـ HTML/CSS/JS خام (بدون أي أداة بناء/bundler) + Firebase (Auth + Firestore) + Cloudinary لرفع الصور.

## هيكل المشروع

```
Souq-aldeir/
│
├── index.html          ← الصفحة الرئيسية (الواجهة الكاملة SPA بنظام bottom-sheet modals)
├── admin.html          ← لوحة المدير كصفحة مستقلة (تتحقق من صلاحية role=admin)
├── login.html          ← صفحة دخول/تسجيل مستقلة (اختيارية، نفس منطق index.html)
│
├── public/
│   ├── logo.png         ← ضع شعار السوق هنا
│   ├── icons/           ← أيقونات إضافية (favicon، PWA...)
│   └── images/          ← صور ثابتة للموقع
│
├── src/
│   ├── css/
│   │   └── style.css    ← كل تنسيقات الموقع (مستخرجة من <style> الأصلي)
│   │
│   ├── js/
│   │   ├── firebase.js  ← تهيئة Firebase + إعدادات Cloudinary/واتساب + الحالة المشتركة (allAds, currentUser...)
│   │   ├── app.js       ← نقطة الدخول: يربط كل الملفات ويشغّل التطبيق (Boot)
│   │   ├── ads.js        ← الفئات، تحميل/فلترة/عرض الإعلانات، المفضلة، تفاصيل الإعلان، إضافة/تعديل/حذف، طلب تمييز
│   │   ├── auth.js       ← تسجيل الدخول/حساب جديد/استرجاع كلمة المرور/الخروج/لوحة "حسابي"
│   │   ├── chat.js       ← الرسائل بين البائع والمشتري (قائمة محادثات + نافذة محادثة)
│   │   ├── admin.js      ← لوحة المدير: طلبات التمييز، إدارة الإعلانات، الشريط الإخباري
│   │   └── utils.js      ← دوال مساعدة عامة (timeAgo...)
│   │
│   └── components/
│       ├── modal.js      ← فتح/إغلاق نوافذ bottom-sheet + إغلاق بالنقر خارج النافذة
│       ├── slider.js      ← سلايدر الإعلانات المميزة في الأعلى
│       └── toast.js       ← إشعارات Toast السفلية
│
├── firebase.json         ← إعدادات Firebase Hosting + مسار قواعد Firestore
├── firestore.rules       ← قواعد أمان Firestore (ads/users/chats/featuredRequests/settings)
├── vercel.json           ← إعدادات النشر على Vercel (بديل لـ Firebase Hosting)
└── README.md
```

## ترتيب تحميل ملفات JS (مهم جداً)

في `index.html` و`admin.html` يجب أن يبقى ترتيب الـ `<script>` كما هو، لأن كل ملف يعتمد على متغيرات/دوال معرّفة في الملف الذي قبله:

1. Firebase SDK (app / auth / firestore) من gstatic
2. `src/js/firebase.js` — يهيّئ `firebase`, `auth`, `db` ويُعرّف المتغيرات العامة (`currentUser`, `allAds`, ...)
3. `src/js/utils.js`
4. `src/components/toast.js`
5. `src/components/modal.js`
6. `src/components/slider.js`
7. `src/js/ads.js`
8. `src/js/auth.js`
9. `src/js/chat.js`
10. `src/js/admin.js`
11. `src/js/app.js` — آخر ملف، يستدعي `initApp()` عند `DOMContentLoaded`

هذا المشروع لا يستخدم ES Modules أو bundler، فكل الدوال معرّفة على النطاق العام (global scope)
عبر وسوم `<script src="...">` عادية — بنفس الطريقة التي كانت تعمل بها في ملف الـ HTML الواحد الأصلي.

## قبل النشر — أشياء يجب تغييرها

في `src/js/firebase.js`:
- `ADMIN_EMAIL`
- `CLOUDINARY_CLOUD` / `CLOUDINARY_PRESET` (حساب Cloudinary الخاص بك)
- `WHATSAPP_NUMBER` (رقم واتساب الإدارة لاستقبال طلبات التمييز)
- بيانات `firebase.initializeApp({...})` إذا أنشأت مشروع Firebase جديد

في `src/js/auth.js`:
- كلمة السر `SOUQ2025ADMIN` المستخدمة في `makeAdmin()` — غيّرها فوراً، وفضّل نقل منح صلاحية
  "مدير" إلى Cloud Function أو تعديل يدوي من Firebase Console بدل ترك كود ثابت في الواجهة.

## النشر

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # اختر هذا المجلد كـ public directory
firebase deploy
```

### Vercel
```bash
npm install -g vercel
vercel
```

## ملاحظات أمان مهمة

- `firestore.rules` المرفقة تغطي القواعد الأساسية (كل مستخدم يعدّل إعلاناته فقط، المدير له صلاحيات كاملة،
  الرسائل بين المشاركين فقط). راجعها وشدّدها حسب حاجتك قبل الإطلاق الفعلي.
- ميزة "اضغط 5 مرات على v2.0 لتصبح مديراً" (`secretAdminTap` في `auth.js`) وكلمة سر `makeAdmin()`
  هي أدوات إعداد أولية سريعة — يُنصح بإزالتها أو حمايتها بشكل أفضل (Cloud Function + تحقق يدوي) بعد
  تعيين أول حساب مدير على مشروعك.
