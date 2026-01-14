// إعدادات مشروع souq-dier
const firebaseConfig = {
  apiKey: "أدخل_مفتاح_API_هنا",  // ⚠️ ابحث عنه في الخطوة التالية
  authDomain: "souq-dier.firebaseapp.com",
  databaseURL: "https://souq-dier.firebaseio.com",
  projectId: "souq-dier",
  storageBucket: "souq-dier.appspot.com",
  messagingSenderId: "أدخل_الرقم",
  appId: "1:رقم:web:معرف"
};

// تهيئة Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// رسالة نجاح
console.log("✅ متصل بمشروع: souq-dier");