// src/js/firebase.js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlFgTzlcbaS6NKKlqyOvrxYAnKmxXLTLQ",
  authDomain: "souq-aldeir.firebaseapp.com",
  projectId: "souq-aldeir",
  storageBucket: "souq-aldeir.firebasestorage.app",
  messagingSenderId: "153018999224",
  appId: "1:153018999224:web:ddfb7660584941091f6f4d"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();