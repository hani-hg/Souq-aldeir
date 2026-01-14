// 📁 firebase-config.js
// إعدادات مشروع Firebase لـ "سوق دير الزور"

const firebaseConfig = {
    apiKey: "AIzaSyA2FhsRlX4SMpGhzfI0oq_lArSsPTGHUsY",
    authDomain: "souq-aldeir-4ed7b.firebaseapp.com",
    projectId: "souq-aldeir-4ed7b",
    storageBucket: "souq-aldeir-4ed7b.firebasestorage.app",
    messagingSenderId: "925621854708",
    appId: "1:925621854708:web:0a830d0684bc75f6be99a1",
    measurementId: "G-J14JVX1HW4"
};

// تهيئة Firebase
let firebaseApp, firestoreDb, storageRef, authRef;

try {
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase تم تهيئته بنجاح!");
    } else {
        firebaseApp = firebase.app();
        console.log("✅ Firebase مثبت مسبقاً");
    }
    
    firestoreDb = firebase.firestore();
    storageRef = firebase.storage();
    authRef = firebase.auth();
    
    console.log("🚀 جميع خدمات Firebase جاهزة");
    
} catch (error) {
    console.error("❌ خطأ في تهيئة Firebase:", error);
}

// ============================================
// دوال العمل مع Firebase
// ============================================

async function saveNewAd(adData) {
    try {
        const adWithMetadata = {
            ...adData,
            status: "active",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            views: 0,
            saves: 0
        };
        
        const docRef = await firestoreDb.collection("ads").add(adWithMetadata);
        
        return {
            success: true,
            adId: docRef.id,
            message: "تم نشر إعلانك بنجاح"
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

async function getAds(filters = {}) {
    try {
        let query = firestoreDb.collection("ads");
        
        if (filters.category) {
            query = query.where("category", "==", filters.category);
        }
        
        query = query.where("status", "==", "active");
        
        if (filters.sortBy === "price-low") {
            query = query.orderBy("price", "asc");
        } else if (filters.sortBy === "price-high") {
            query = query.orderBy("price", "desc");
        } else {
            query = query.orderBy("createdAt", "desc");
        }
        
        const snapshot = await query.limit(50).get();
        const ads = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            ads.push({
                id: doc.id,
                title: data.title,
                description: data.description,
                price: data.price,
                category: data.category,
                location: data.location || "دير الزور",
                sellerName: data.sellerName || "بائع",
                images: data.images || [],
                createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
                views: data.views || 0
            });
        });
        
        return {
            success: true,
            ads: ads,
            total: ads.length
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message,
            ads: []
        };
    }
}

async function getCategories() {
    try {
        const snapshot = await firestoreDb.collection("categories").get();
        const categories = [];
        
        snapshot.forEach(doc => {
            categories.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return {
            success: true,
            categories: categories
        };
        
    } catch (error) {
        // إذا لم تكن الفئات موجودة، نرجع الفئات الافتراضية
        const defaultCategories = [
            { id: "vehicles", name: "سيارات ومركبات", icon: "🚗", count: 0 },
            { id: "realestate", name: "عقارات وشقق", icon: "🏠", count: 0 },
            { id: "electronics", name: "إلكترونيات", icon: "💻", count: 0 },
            { id: "phones", name: "هواتف وأرقام", icon: "📱", count: 0 },
            { id: "jobs", name: "وظائف وخدمات", icon: "💼", count: 0 }
        ];
        
        return {
            success: true,
            categories: defaultCategories
        };
    }
}

async function checkFirebaseConnection() {
    try {
        const startTime = Date.now();
        await firestoreDb.collection("_test").limit(1).get();
        const endTime = Date.now();
        
        return {
            connected: true,
            responseTime: endTime - startTime,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            connected: false,
            error: error.message
        };
    }
}

async function initializeDatabase() {
    try {
        const adsSnapshot = await firestoreDb.collection("ads").limit(1).get();
        
        if (adsSnapshot.empty) {
            console.log("📭 إنشاء قاعدة بيانات جديدة...");
            
            // إنشاء فئات أساسية
            const categories = [
                { id: "vehicles", name: "سيارات ومركبات", icon: "🚗", count: 0, order: 1 },
                { id: "realestate", name: "عقارات وشقق", icon: "🏠", count: 0, order: 2 },
                { id: "electronics", name: "إلكترونيات", icon: "💻", count: 0, order: 3 },
                { id: "phones", name: "هواتف وأرقام", icon: "📱", count: 0, order: 4 },
                { id: "jobs", name: "وظائف وخدمات", icon: "💼", count: 0, order: 5 },
                { id: "animals", name: "حيوانات وطيور", icon: "🐕", count: 0, order: 6 },
                { id: "home", name: "أثاث ومنزل", icon: "🛋️", count: 0, order: 7 },
                { id: "fashion", name: "موضة وأزياء", icon: "👕", count: 0, order: 8 }
            ];
            
            const batch = firestoreDb.batch();
            categories.forEach(category => {
                const docRef = firestoreDb.collection("categories").doc(category.id);
                batch.set(docRef, {
                    ...category,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            
            await batch.commit();
            return { initialized: true, message: "تم إنشاء قاعدة بيانات جديدة" };
        }
        
        return { initialized: false, message: "قاعدة البيانات موجودة بالفعل" };
        
    } catch (error) {
        return { initialized: false, error: error.message };
    }
}

// تصدير الدوال للاستخدام
window.FirebaseApp = {
    db: firestoreDb,
    storage: storageRef,
    auth: authRef,
    config: firebaseConfig,
    
    saveNewAd: saveNewAd,
    getAds: getAds,
    getCategories: getCategories,
    checkConnection: checkFirebaseConnection,
    initializeDatabase: initializeDatabase,
    
    isInitialized: !!firebaseApp
};

console.log("🚀 سوق دير الزور - نظام Firebase جاهز");