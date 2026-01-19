// 📁 firebase-config.js
// إعدادات Firebase (استخدم إعداداتك من console.firebase.google.com)
const firebaseConfig = {
    apiKey: "AIzaSyA2FhsRLX4SMpGhzfI0oq_lArSsPTGHUsY",
    authDomain: "souq-aldeir-4ed7b.firebaseapp.com",
    databaseURL: "https://souq-aldeir-4ed7b.firebaseio.com",
    projectId: "souq-aldeir-4ed7b",
    storageBucket: "souq-aldeir-4ed7b.appspot.com",
    messagingSenderId: "623000800110",
    appId: "1:623000800110:web:9f6c8d5a3f7d4c6"
};

// تهيئة Firebase
let firebaseApp, firestoreDb;

// تحميل Firebase عند توفر المكتبات
function initFirebase() {
    try {
        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
            console.log("✅ Firebase مهيأ");
            firestoreDb = firebase.firestore();
            return true;
        }
        return false;
    } catch (error) {
        console.warn("⚠️ وضع تجريبي بدون Firebase");
        return false;
    }
}

// دوال العمل مع Firebase
window.FirebaseApp = {
    init: initFirebase,
    config: firebaseConfig,
    
    async getCategories() {
        if (!firestoreDb) return { success: false, categories: [] };
        try {
            const snapshot = await firestoreDb.collection('categories').get();
            const categories = [];
            snapshot.forEach(doc => categories.push({ id: doc.id, ...doc.data() }));
            return { success: true, categories };
        } catch (error) {
            return { success: false, categories: [] };
        }
    },
    
    async getAds() {
        if (!firestoreDb) return { success: false, ads: [] };
        try {
            const snapshot = await firestoreDb.collection('ads')
                .where('status', '==', 'active')
                .orderBy('createdAt', 'desc')
                .limit(50)
                .get();
            const ads = [];
            snapshot.forEach(doc => ads.push({ id: doc.id, ...doc.data() }));
            return { success: true, ads };
        } catch (error) {
            return { success: false, ads: [] };
        }
    }
};