// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCL5sxyVefa8tQKwCGiW2kToZH1lctQFLA",
  authDomain: "stream-chat-app-mobile.firebaseapp.com",
  projectId: "stream-chat-app-mobile",
  storageBucket: "stream-chat-app-mobile.appspot.com",
  messagingSenderId: "789992888335",
  appId: "1:789992888335:web:5884693eebeee7b799eb7a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
