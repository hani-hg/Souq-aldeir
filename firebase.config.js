// إعدادات Firebase الصحيحة - مشروع souq-aldeir-4ed7b
const firebaseConfig = {
  apiKey: "AIzaSyA2FhsRlX4SMpGhzfI0oq_lArSsPTGHUsY",
  authDomain: "souq-aldeir-4ed7b.firebaseapp.com",
  projectId: "souq-aldeir-4ed7b",
  storageBucket: "souq-aldeir-4ed7b.firebasestorage.app",
  messagingSenderId: "925621854708",
  appId: "1:925621854708:web:0a830d0684bc75f6be99a1",
  measurementId: "G-J14JVX1HW4"
};

// تهيئة Firebase مع التحقق من عدم التهيئة المزدوجة
if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("✅ تم تهيئة Firebase بنجاح - مشروع souq-aldeir-4ed7b");
  } else {
    console.log("ℹ️ Firebase مهيأ مسبقاً");
  }
} else {
  console.error("❌ مكتبات Firebase غير محملة!");
}

// إصلاح خاص للتطبيق - اجعل firebase متاحاً عالمياً
window.firebaseApp = firebase;