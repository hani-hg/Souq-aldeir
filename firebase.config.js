// ====================================
// 🔥 تكوين Firebase - سوق دير الزور
// ====================================
// استبدل هذه القيم ببياناتك من Firebase Console
// اذهب إلى: Firebase Console → إعدادات المشروع → تطبيقاتك → تطبيق الويب

const firebaseConfig = {
  apiKey: "AIzaSyBqD...eE4mI",                    // استبدل بـ apiKey الخاص بك
  authDomain: "souq-dier.firebaseapp.com",       // استبدل بـ authDomain الخاص بك
  projectId: "souq-dier",                        // استبدل بـ projectId الخاص بك
  storageBucket: "souq-dier.appspot.com",        // استبدل بـ storageBucket الخاص بك
  messagingSenderId: "105...203",                // استبدل بـ messagingSenderId الخاص بك
  appId: "1:105...203:web:a0d...f1c"             // استبدل بـ appId الخاص بك
};

// ====================================
// ⚙️ تهيئة Firebase
// ====================================
try {
    // التحقق من عدم وجود تهيئة سابقة
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase initialized successfully!");
        console.log("📊 Project:", firebaseConfig.projectId);
    } else {
        firebase.app(); // استخدام التطبيق الموجود
        console.log("⚠️ Firebase already initialized");
    }
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
}

// ====================================
// 📤 تصدير خدمات Firebase للاستخدام
// ====================================
const auth = firebase.auth ? firebase.auth() : null;
const db = firebase.firestore ? firebase.firestore() : null;
const storage = firebase.storage ? firebase.storage() : null;

// ====================================
// 🔍 دالة للتحقق من الاتصال (اختيارية)
// ====================================
function checkFirebaseConnection() {
    const results = {
        initialized: false,
        projectId: null,
        services: {
            auth: false,
            firestore: false,
            storage: false
        }
    };
    
    try {
        const app = firebase.app();
        results.initialized = true;
        results.projectId = app.options.projectId;
        
        if (firebase.auth) results.services.auth = true;
        if (firebase.firestore) results.services.firestore = true;
        if (firebase.storage) results.services.storage = true;
        
        return results;
    } catch (error) {
        return { error: error.message };
    }
}

// طباعة حالة الاتصال عند التحميل
setTimeout(() => {
    const connection = checkFirebaseConnection();
    if (connection.initialized) {
        console.log("🔗 Firebase Connection Status:", connection);
    }
}, 1000);