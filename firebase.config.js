// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2FhsRlX4SMpGhzfI0oq_lArSsPTGHUsY",
  authDomain: "souq-aldeir-4ed7b.firebaseapp.com",
  projectId: "souq-aldeir-4ed7b",
  storageBucket: "souq-aldeir-4ed7b.firebasestorage.app",
  messagingSenderId: "925621854708",
  appId: "1:925621854708:web:97c1b7718cc6ea25be99a1",
  measurementId: "G-XT1Y4WHXE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);