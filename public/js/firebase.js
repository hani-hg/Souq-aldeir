const firebaseConfig = {
    apiKey: "AIzaSyCTRpzhyBsf-h9rh2AO6OuIAy_kE7k7fpY",
    authDomain: "souq-aldeir-8b708.firebaseapp.com",
    projectId: "souq-aldeir-8b708",
    storageBucket: "souq-aldeir-8b708.firebasestorage.app",
    messagingSenderId: "718751448398",
    appId: "1:718751448398:web:b588ab6753d1fc7aa1321f"
};
firebase.initializeApp(firebaseConfig);
window.auth = firebase.auth();
window.db = firebase.firestore();
window.storage = firebase.storage();