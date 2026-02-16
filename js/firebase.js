import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTRpzhyBsf-h9rh2AO6OuIAy_kE7k7fpY",
  authDomain: "souq-aldeir-8b708.firebaseapp.com",
  projectId: "souq-aldeir-8b708",
  storageBucket: "souq-aldeir-8b708.appspot.com",
  messagingSenderId: "718751448398",
  appId: "1:718751448398:web:b588ab6753d1fc7aa1321f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);