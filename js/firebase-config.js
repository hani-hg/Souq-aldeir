/* ============================================================
   firebase.js
   Firebase initialization + shared third-party config constants.
   Must be loaded AFTER the Firebase SDK <script> tags and
   BEFORE every other src/js/*.js file.
   ============================================================ */

/* ---- Third-party / project config ----
   These are now DEFAULTS ONLY: the admin panel's "⚙️ إعدادات التواصل"
   section lets the site owner change email/phone/WhatsApp any time
   without touching code, saved to Firestore (settings/contact) and
   read at boot into `contactSettings` (see below + ads.js/admin.js). */
const ADMIN_EMAIL = 'hg78@live.com';
const ADMIN_PHONE = '+90 552 274 09 10';
const CLOUDINARY_CLOUD = 'dzjy5tubx';
const CLOUDINARY_PRESET = 'souq_ads';
const WHATSAPP_NUMBER = '905522740910'; // نفس رقم الهاتف أعلاه، بصيغة دولية بدون + أو مسافات

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
let chatUnsub = null;        // unsubscribes the currently open chat's messages listener
let chatsListUnsub = null;   // unsubscribes the live "all my chats" listener (list + badge)
let chatsCache = [];         // latest snapshot of the user's chats, sorted client-side (no composite index needed)
let chatSeenMap = {};        // { chatId: lastSeenMillis } - loaded from/saved to localStorage
let slideIdx = 0;
let slideTimer = null;
let featuredAds = [];
let myWarnings = []; // unread admin warnings for the signed-in user

/* Editable contact info: admin can change these from the panel without
   touching code (see admin.js saveContactSettings / loadContactSettings). */
let contactSettings = { email: ADMIN_EMAIL, phone: ADMIN_PHONE, whatsapp: WHATSAPP_NUMBER };


