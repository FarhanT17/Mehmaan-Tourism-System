import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAl1SJ_NNo0griYXAOu0u3NBN03UT0-Ick",
  authDomain: "mehmaan-pakistan-website-243bd.firebaseapp.com",
  databaseURL:
    "https://mehmaan-pakistan-website-243bd-default-rtdb.firebaseio.com",
  projectId: "mehmaan-pakistan-website-243bd",
  storageBucket: "mehmaan-pakistan-website-243bd.appspot.com",
  messagingSenderId: "973426316223",
  appId: "1:973426316223:web:20c03a80892a2cd29d470a",
  measurementId: "G-JY452VFYF6",
};

/* if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
} */
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = getFirestore(app);
export const storage = getStorage(app);
const auth = firebase.auth();

export { db, auth };
