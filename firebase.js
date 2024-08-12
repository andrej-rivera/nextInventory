// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBg3_I1Y6HynelN4fRzUBa3TmRRa2LQQlo",
  authDomain: "inventory-b6837.firebaseapp.com",
  projectId: "inventory-b6837",
  storageBucket: "inventory-b6837.appspot.com",
  messagingSenderId: "739891790444",
  appId: "1:739891790444:web:0cf6ad8ec31e1c0b704e49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firebaseConfig, firestore};