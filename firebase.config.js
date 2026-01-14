// إعدادات Firebase الصحيحة لتطبيق سوق دير الزور
const firebaseConfig = {
  apiKey: "AIzaSyA2FhsRlX4SMpGhzfI0oq_lArSsPTGHUsY",
  authDomain: "souq-aldeir-4ed7b.firebaseapp.com",
  projectId: "souq-aldeir-4ed7b",
  storageBucket: "souq-aldeir-4ed7b.firebasestorage.app",
  messagingSenderId: "925621854708",
  appId: "1:925621854708:web:0a830d0684bc75f6be99a1",
  measurementId: "G-J14JVX1HW4"
};

// تأكد من تهيئة Firebase مرة واحدة فقط
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("✅ تم إصلاح Firebase على الهاتف!");
}

// حل إضافي: إعادة تعريف دالة التسجيل
window.fixFirebase = function() {
  const email = "test_" + Date.now() + "@souq.com";
  const password = "123456";
  
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("✅ تم التسجيل بنجاح!\nبريد: " + email);
    })
    .catch(error => {
      alert("❌ خطأ: " + error.message);
    });
};