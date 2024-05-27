// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2ZTrdnIRPqgxN8g88CeBv6YKheEZomxA",
  authDomain: "gerente-loja-db971.firebaseapp.com",
  projectId: "gerente-loja-db971",
  storageBucket: "gerente-loja-db971.appspot.com",
  messagingSenderId: "425432218749",
  appId: "1:425432218749:web:62bee8e4a7b965df260514"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

export const auth = getAuth(app);
