/* ============================================================
   FIREBASE CONFIG & INIT
   إعدادات الاتصال بـ Firebase - كل الصفحات تحمّل هذا الملف أولاً
============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyAlFgTzlcbaS6NKKlqyOvrxYAnKmxXLTLQ",
  authDomain: "souq-aldeir.firebaseapp.com",
  projectId: "souq-aldeir",
  storageBucket: "souq-aldeir.firebasestorage.app",
  messagingSenderId: "153018999224",
  appId: "1:153018999224:web:ddfb7660584941091f6f4d"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

/* إعدادات عامة للموقع - عدّل هذه القيم حسب حاجتك */
const CONFIG = {
  CLOUDINARY_CLOUD: 'dzjy5tubx',
  CLOUDINARY_PRESET: 'souq_ads',
  WHATSAPP_NUMBER: '963XXXXXXXXX',      // غيّر لرقم واتساب الإدارة
  ADMIN_SETUP_CODE: 'SOUQ2025ADMIN'     // رمز سري لتفعيل أول مدير
};
