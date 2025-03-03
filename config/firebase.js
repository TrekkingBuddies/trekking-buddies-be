import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZua5XZIXQbeWrt6RqonCO0axPgGdPaZc",
  authDomain: "trekkingbuddies-c8378.firebaseapp.com",
  projectId: "trekkingbuddies-c8378",
  storageBucket: "trekkingbuddies-c8378.firebasestorage.app",
  messagingSenderId: "590056416480",
  appId: "1:590056416480:web:d9871c980cc5743cba1c85"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
