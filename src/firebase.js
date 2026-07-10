/* ============================================================
   firebase.js
   Firebase initialization + shared third-party config constants.
   Must be loaded AFTER the Firebase SDK <script> tags and
   BEFORE every other src/js/*.js file.
   ============================================================ */

/* ---- Third-party / project config ---- */
const ADMIN_EMAIL = 'admin@souq-aldeir.com'; // غيّر هذا لبريدك
const CLOUDINARY_CLOUD = 'dzjy5tubx';
const CLOUDINARY_PRESET = 'souq_ads';
const WHATSAPP_NUMBER = '963XXXXXXXXX'; // غيّر لرقمك

/* ---- Firebase init ---- */
firebase.initializeApp({
  apiKey: "AIzaSyAlFgTzlcbaS6NKKlqyOvrxYAnKmxXLTLQ",
  authDomain: "souq-aldeir.firebaseapp.com",
  projectId: "souq-aldeir",
  storageBucket: "souq-aldeir.firebasestorage.app",
  messagingSenderId: "153018999224",
  appId: "1:153018999224:web:ddfb7660584941091f6f4d"
});

const auth = firebase.auth();
const db = firebase.firestore();

/* ---- Shared global state (used across all modules) ---- */
let currentUser = null;
let isAdmin = false;
let allAds = [];
let favorites = new Set();
let activeCat = null;
let selectedPlan = '3 أيام - 1$';
let chatUnsub = null;
let slideIdx = 0;
let slideTimer = null;
let featuredAds = [];
