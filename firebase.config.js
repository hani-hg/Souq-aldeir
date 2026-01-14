// 📁 firebase-config.js
// ============================================
// إعدادات مشروع Firebase لـ "سوق دير الزور"
// ============================================

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
    
    // تهيئة الخدمات
    firestoreDb = firebase.firestore();
    storageRef = firebase.storage();
    authRef = firebase.auth();
    
    console.log("🚀 جميع خدمات Firebase جاهزة:");
    console.log("- Firestore: جاهز");
    console.log("- Storage: جاهز");
    console.log("- Authentication: جاهز");
    
} catch (error) {
    console.error("❌ خطأ في تهيئة Firebase:", error);
    console.warn("⚠️ الموقع يعمل في الوضع التجريبي بدون قاعدة بيانات");
}

// ============================================
// دوال المساعدة العامة
// ============================================

/**
 * تحقق من اتصال Firebase
 * @returns {Promise<Object>} حالة الاتصال
 */
async function checkFirebaseConnection() {
    try {
        const startTime = Date.now();
        await firestoreDb.collection("_test").limit(1).get();
        const endTime = Date.now();
        
        return {
            connected: true,
            responseTime: endTime - startTime,
            services: {
                firestore: true,
                storage: true,
                auth: true
            },
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            connected: false,
            error: error.message,
            services: {
                firestore: false,
                storage: false,
                auth: false
            }
        };
    }
}

/**
 * إنشاء قاعدة بيانات افتراضية إذا كانت فارغة
 */
async function initializeDatabase() {
    console.log("🔍 التحقق من قاعدة البيانات...");
    
    try {
        // التحقق من وجود إعلانات
        const adsSnapshot = await firestoreDb.collection("ads").limit(1).get();
        
        if (adsSnapshot.empty) {
            console.log("📭 قاعدة البيانات فارغة، جاري إنشاء بيانات تجريبية...");
            await createSampleData();
            return { initialized: true, message: "تم إنشاء بيانات تجريبية" };
        } else {
            const count = await firestoreDb.collection("ads").count().get();
            console.log(`✅ قاعدة البيانات تحتوي على ${count.data().count} إعلان`);
            return { initialized: false, count: count.data().count };
        }
    } catch (error) {
        console.error("❌ خطأ في التحقق من قاعدة البيانات:", error);
        return { initialized: false, error: error.message };
    }
}

/**
 * إنشاء بيانات تجريبية
 */
async function createSampleData() {
    const sampleCategories = [
        { id: "vehicles", name: "سيارات ومركبات", icon: "🚗", count: 0, color: "#FF6B6B" },
        { id: "realestate", name: "عقارات وشقق", icon: "🏠", count: 0, color: "#4ECDC4" },
        { id: "electronics", name: "إلكترونيات", icon: "💻", count: 0, color: "#45B7D1" },
        { id: "phones", name: "هواتف وأرقام", icon: "📱", count: 0, color: "#96CEB4" },
        { id: "jobs", name: "وظائف وخدمات", icon: "💼", count: 0, color: "#FFEAA7" },
        { id: "animals", name: "حيوانات وطيور", icon: "🐕", count: 0, color: "#DDA0DD" },
        { id: "home", name: "أثاث ومنزل", icon: "🛋️", count: 0, color: "#98D8C8" },
        { id: "fashion", name: "موضة وأزياء", icon: "👕", count: 0, color: "#F7DC6F" }
    ];

    const sampleAds = [
        {
            title: "سيارة تويوتا كامري 2020 للبيع",
            description: "سيارة بحالة ممتازة، موديل 2020، لون أبيض، كامل المواصفات، بدون حوادث، صيانة دورية في الوكالة. أميال: 45000 كم، جير أوتوماتيك، تكييف، فتحة سقف.",
            price: 18500,
            category: "vehicles",
            location: "دير الزور",
            sellerName: "أحمد محمد",
            sellerPhone: "0991234567",
            images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"],
            status: "active",
            featured: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            views: 124,
            saves: 8
        },
        {
            title: "شقة للايجار في حي الزهور",
            description: "شقة طابق ثالث، 3 غرف نوم، صالة كبيرة، مطبخ مجهز، 2 حمام، تكييف مركزي، موقف سيارات. المساحة: 150م²، تشطيب سوبر لوكس، شارع هاديء.",
            price: 350,
            category: "realestate",
            location: "الحسكة",
            sellerName: "محمد علي",
            sellerPhone: "0947654321",
            images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"],
            status: "active",
            featured: true,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date(Date.now() - 86400000)), // يوم مضى
            views: 89,
            saves: 12
        },
        {
            title: "لابتوب ديل جديد للبيع",
            description: "لابتوب ديل اكس بي اس 13، معالج i7 الجيل العاشر، ذاكرة 16 جيجا، شاشة لمس 4K، بطارية جديدة، ضمان سنة. SSD 512 جيجا، كرت شاشة مدمج، وزن خفيف.",
            price: 1200,
            category: "electronics",
            location: "الرقة",
            sellerName: "سارة خالد",
            sellerPhone: "0985551234",
            images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"],
            status: "active",
            featured: false,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date(Date.now() - 172800000)), // يومين مضى
            views: 156,
            saves: 5
        }
    ];

    try {
        // إضافة الفئات
        const categoriesBatch = firestoreDb.batch();
        const categoriesRef = firestoreDb.collection("categories");
        
        sampleCategories.forEach(category => {
            const docRef = categoriesRef.doc(category.id);
            categoriesBatch.set(docRef, {
                ...category,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                order: sampleCategories.indexOf(category) + 1
            });
        });
        
        await categoriesBatch.commit();
        console.log(`✅ تم إضافة ${sampleCategories.length} فئة`);
        
        // إضافة الإعلانات
        const adsBatch = firestoreDb.batch();
        const adsRef = firestoreDb.collection("ads");
        
        sampleAds.forEach(ad => {
            const docRef = adsRef.doc();
            adsBatch.set(docRef, ad);
        });
        
        await adsBatch.commit();
        console.log(`✅ تم إضافة ${sampleAds.length} إعلان تجريبي`);
        
        // تحديث عداد الفئات
        await updateCategoryCounters();
        
        return { success: true, categories: sampleCategories.length, ads: sampleAds.length };
        
    } catch (error) {
        console.error("❌ خطأ في إنشاء البيانات:", error);
        return { success: false, error: error.message };
    }
}

/**
 * تحديث عداد الإعلانات في كل فئة
 */
async function updateCategoryCounters() {
    try {
        const categories = await firestoreDb.collection("categories").get();
        const updatePromises = [];
        
        categories.forEach(categoryDoc => {
            const categoryId = categoryDoc.id;
            const countPromise = firestoreDb.collection("ads")
                .where("category", "==", categoryId)
                .where("status", "==", "active")
                .count()
                .get()
                .then(snapshot => {
                    return categoryDoc.ref.update({
                        count: snapshot.data().count,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                });
            
            updatePromises.push(countPromise);
        });
        
        await Promise.all(updatePromises);
        console.log("✅ تم تحديث عدادات الفئات");
        
    } catch (error) {
        console.error("❌ خطأ في تحديث العدادات:", error);
    }
}

/**
 * حفظ إعلان جديد
 * @param {Object} adData - بيانات الإعلان
 * @returns {Promise<Object>} نتيجة الحفظ
 */
async function saveNewAd(adData) {
    try {
        // إضافة بيانات افتراضية
        const adWithMetadata = {
            ...adData,
            status: "active",
            featured: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            views: 0,
            saves: 0,
            sellerId: authRef.currentUser ? authRef.currentUser.uid : "anonymous"
        };
        
        // إضافة إلى Firestore
        const docRef = await firestoreDb.collection("ads").add(adWithMetadata);
        
        // تحديث عداد الفئة
        await firestoreDb.collection("categories")
            .doc(adData.category)
            .update({
                count: firebase.firestore.FieldValue.increment(1),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        
        console.log("✅ تم حفظ الإعلان بنجاح:", docRef.id);
        
        return {
            success: true,
            adId: docRef.id,
            message: "تم نشر إعلانك بنجاح",
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error("❌ خطأ في حفظ الإعلان:", error);
        return {
            success: false,
            error: error.message,
            message: "فشل نشر الإعلان، حاول مرة أخرى"
        };
    }
}

/**
 * رفع صورة إلى Storage
 * @param {File} file - ملف الصورة
 * @param {string} adId - معرّف الإعلان
 * @returns {Promise<Object>} رابط الصورة
 */
async function uploadAdImage(file, adId) {
    try {
        const fileExtension = file.name.split('.').pop();
        const fileName = `ads/${adId}/${Date.now()}.${fileExtension}`;
        const storageRef = firebase.storage().ref(fileName);
        
        // رفع الملف
        const snapshot = await storageRef.put(file);
        
        // الحصول على رابط التنزيل
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        return {
            success: true,
            url: downloadURL,
            fileName: fileName,
            size: file.size,
            contentType: file.type
        };
        
    } catch (error) {
        console.error("❌ خطأ في رفع الصورة:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * جلب الإعلانات مع إمكانية التصفية
 * @param {Object} filters - مرشحات البحث
 * @returns {Promise<Array>} قائمة الإعلانات
 */
async function getAds(filters = {}) {
    try {
        let query = firestoreDb.collection("ads");
        
        // تطبيق المرشحات
        if (filters.category) {
            query = query.where("category", "==", filters.category);
        }
        
        if (filters.status) {
            query = query.where("status", "==", filters.status);
        } else {
            query = query.where("status", "==", "active");
        }
        
        if (filters.minPrice !== undefined) {
            query = query.where("price", ">=", Number(filters.minPrice));
        }
        
        if (filters.maxPrice !== undefined) {
            query = query.where("price", "<=", Number(filters.maxPrice));
        }
        
        if (filters.location) {
            query = query.where("location", "==", filters.location);
        }
        
        // الترتيب
        if (filters.sortBy === "price-low") {
            query = query.orderBy("price", "asc");
        } else if (filters.sortBy === "price-high") {
            query = query.orderBy("price", "desc");
        } else if (filters.sortBy === "newest") {
            query = query.orderBy("createdAt", "desc");
        } else if (filters.sortBy === "popular") {
            query = query.orderBy("views", "desc");
        } else {
            query = query.orderBy("createdAt", "desc");
        }
        
        // تحديد الحد
        if (filters.limit) {
            query = query.limit(Number(filters.limit));
        } else {
            query = query.limit(50);
        }
        
        const snapshot = await query.get();
        const ads = [];
        
        snapshot.forEach(doc => {
            ads.push({
                id: doc.id,
                ...doc.data(),
                // تحويل التواريخ
                createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null,
                updatedAt: doc.data().updatedAt ? doc.data().updatedAt.toDate() : null
            });
        });
        
        return {
            success: true,
            ads: ads,
            total: ads.length,
            hasMore: ads.length === (filters.limit || 50)
        };
        
    } catch (error) {
        console.error("❌ خطأ في جلب الإعلانات:", error);
        return {
            success: false,
            error: error.message,
            ads: []
        };
    }
}

/**
 * جلب الفئات
 * @returns {Promise<Array>} قائمة الفئات
 */
async function getCategories() {
    try {
        const snapshot = await firestoreDb.collection("categories")
            .orderBy("order", "asc")
            .get();
        
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
        console.error("❌ خطأ في جلب الفئات:", error);
        return {
            success: false,
            error: error.message,
            categories: []
        };
    }
}

/**
 * تسجيل زيارة إعلان
 * @param {string} adId - معرّف الإعلان
 */
async function trackAdView(adId) {
    try {
        await firestoreDb.collection("ads").doc(adId).update({
            views: firebase.firestore.FieldValue.increment(1),
            lastViewed: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.warn("⚠️ لم يتم تسجيل الزيارة:", error.message);
    }
}

// ============================================
// تصدير الدوال للاستخدام
// ============================================

window.FirebaseApp = {
    // الخدمات
    db: firestoreDb,
    storage: storageRef,
    auth: authRef,
    app: firebaseApp,
    
    // الدوال
    checkConnection: checkFirebaseConnection,
    initializeDatabase: initializeDatabase,
    saveNewAd: saveNewAd,
    uploadAdImage: uploadAdImage,
    getAds: getAds,
    getCategories: getCategories,
    trackAdView: trackAdView,
    
    // الحالة
    config: firebaseConfig,
    isInitialized: !!firebaseApp
};

// رسالة بدء التشغيل
console.log(`
    🚀 سوق دير الزور - نظام Firebase
    =================================
    المشروع: ${firebaseConfig.projectId}
    النطاق: ${firebaseConfig.authDomain}
    التهيئة: ${!!firebaseApp ? '✅ ناجحة' : '❌ فاشلة'}
    =================================
`);