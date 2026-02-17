// إعدادات Firebase - تأكد من أن هذه القيم تطابق مشروعك الجديد souq-aldeir-8b708
const firebaseConfig = {
    apiKey: "AIzaSyCTRpzhyBsf-h9rh2AO6OuIAy_kE7k7fpY",
    authDomain: "souq-aldeir-8b708.firebaseapp.com",
    projectId: "souq-aldeir-8b708",
    storageBucket: "souq-aldeir-8b708.firebasestorage.app",
    messagingSenderId: "718751448398",
    appId: "1:718751448398:web:b588ab6753d1fc7aa1321f"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// تصدير الخدمات للاستخدام في الملفات الأخرى (باستخدام window لتعريفها كمتغيرات عامة)
window.auth = firebase.auth();
window.db = firebase.firestore();
window.storage = firebase.storage();