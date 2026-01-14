// 📁 firebase-config.js
// إعدادات مشروع Firebase لـ "سوق دير الزور"

const firebaseConfig = {
    apiKey: "AIzaSyA2FhsRLX4SMpGhzfI0oq_lArSsPTGHUsY", // ← استبدل بمفتاحك الكامل
    authDomain: "souq-aldeir-4ed7b.firebaseapp.com",
    databaseURL: "https://souq-aldeir-4ed7b.firebaseio.com",
    projectId: "souq-aldeir-4ed7b",
    storageBucket: "souq-aldeir-4ed7b.appspot.com",
    messagingSenderId: "623000800110",
    appId: "1:623000800110:web:9f6c8d5a3f7d4c6"
};

// تهيئة Firebase
let firebaseApp, firestoreDb;

try {
    // تحميل مكتبات Firebase أولاً
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
            console.log("✅ Firebase تم تهيئته بنجاح!");
        } else {
            firebaseApp = firebase.app();
            console.log("✅ Firebase مثبت مسبقاً");
        }
        
        firestoreDb = firebase.firestore();
        console.log("🚀 Firestore جاهز للاستخدام");
    } else {
        console.warn("⚠️ مكتبات Firebase غير محملة بعد");
    }
} catch (error) {
    console.error("❌ خطأ في تهيئة Firebase:", error);
}

// دوال العمل مع Firebase
window.FirebaseApp = {
    config: firebaseConfig,
    db: firestoreDb,
    app: firebaseApp,
    
    // دالة التحقق من الاتصال
    async checkConnection() {
        try {
            if (!this.db) return { connected: false, error: "Firestore غير مهيأ" };
            
            const startTime = Date.now();
            await this.db.collection("_test").limit(1).get();
            const endTime = Date.now();
            
            return {
                connected: true,
                responseTime: endTime - startTime,
                message: "الاتصال بقاعدة البيانات ناجح"
            };
        } catch (error) {
            return {
                connected: false,
                error: error.message,
                message: "فشل الاتصال بقاعدة البيانات"
            };
        }
    }
};

console.log("🎯 إعدادات Firebase جاهزة لسوق دير الزور");