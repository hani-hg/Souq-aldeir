// config.js - إعدادات Firebase و Cloudinary

const firebaseConfig = {
  apiKey: "AIzaSyCTRpzhyBsf-h9rh2AO6OuIAy_kE7k7fpY",
  authDomain: "souq-aldeir-8b708.firebaseapp.com",
  projectId: "souq-aldeir-8b708",
  storageBucket: "souq-aldeir-8b708.firebasestorage.app",
  messagingSenderId: "718751448398",
  appId: "1:718751448398:web:b588ab6753d1fc7aa1321f"
};

// تهيئة Firebase (تأكد من تحميل Firebase SDK قبل هذا الملف)
firebase.initializeApp(firebaseConfig);

// المصادقة وقاعدة البيانات
const auth = firebase.auth();
const db = firebase.firestore();

// إعدادات Cloudinary
const CLOUD_NAME = 'dzjy5tubx';
const UPLOAD_PRESET = 'souq-aldeir-prseset';