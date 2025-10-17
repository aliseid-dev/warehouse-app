// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCQscghs9QwOXWwPC7G0eL-PLRuFKQXWNk",
  authDomain: "flash-stock.firebaseapp.com",
  projectId: "flash-stock",
  storageBucket: "flash-stock.appspot.com", // ✅ fix here
  messagingSenderId: "208424590915",
  appId: "1:208424590915:web:9f79209597bdbba4b27ef6",
  measurementId: "G-9DB8V9072N"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);