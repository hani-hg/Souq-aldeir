// config.js
const firebaseConfig = {
  apiKey: "// TODO: ضع مفتاح API",
  authDomain: "// TODO: مشروعك.firebaseapp.com",
  projectId: "// TODO: مشروعك",
  storageBucket: "// TODO: مشروعك.appspot.com",
  messagingSenderId: "// TODO",
  appId: "// TODO"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

window.db = db;
window.auth = auth;
window.storage = storage;
