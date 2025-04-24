import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBBTgCxgmZhSnGU8lxhVsIopp2tXbLQ7V0",
  authDomain: "mahmaan-pak.firebaseapp.com",
  projectId: "mahmaan-pak",
  storageBucket: "mahmaan-pak.appspot.com",
  messagingSenderId: "1046467213127",
  appId: "1:1046467213127:web:bdda8a262ddd9e2d3d3e62",
  measurementId: "G-ZTP9DP527E"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage=getStorage()

export { db, auth, storage };
