import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAlFgTzlcbaS6NKKlqyOvrxYAnKmxXLTLQ',
  authDomain: 'souq-aldeir.firebaseapp.com',
  projectId: 'souq-aldeir',
  storageBucket: 'souq-aldeir.firebasestorage.app',
  messagingSenderId: '153018999224',
  appId: '1:153018999224:web:ddfb7660584941091f6f4d'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();

export const ADMIN_EMAIL = 'hg78@live.com';
export const CLOUDINARY_CLOUD = 'dzjy5tubx';
export const CLOUDINARY_PRESET = 'souq_ads';

export const CATEGORIES = [
  'سيارات ومركبات', 'عقارات', 'موبايل وأجهزة لوحية', 'إلكترونيات وأجهزة',
  'أجهزة منزلية', 'أثاث وديكور', 'ملابس وأزياء', 'أطفال ورضّع',
  'حيوانات أليفة', 'مواد غذائية ومحاصيل', 'أدوات ومعدات', 'رياضة وترفيه',
  'كتب وأدوات تعليمية', 'وظائف', 'خدمات', 'أخرى'
];

export const AREAS = [
  'دير الزور - المدينة', 'البوكمال', 'الميادين', 'الموحسن', 'عشارة', 'الشحيل',
  'الكسرة', 'الجلاء', 'هجين', 'الصور', 'مركدة', 'خشام', 'ذيبان', 'طيبة الإمام',
  'الصالحية', 'حطلة', 'البصيرة', 'التبني', 'الجنينة', 'الكسرة الفوقاني',
  'غرانيج', 'السبخة', 'صبيخان', 'قرية/منطقة أخرى'
];

export default firebase;
