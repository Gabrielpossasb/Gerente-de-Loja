import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA2ZTrdnIRPqgxN8g88CeBv6YKheEZomxA",
  authDomain: "gerente-loja-db971.firebaseapp.com",
  projectId: "gerente-loja-db971",
  storageBucket: "gerente-loja-db971.appspot.com",
  messagingSenderId: "425432218749",
  appId: "1:425432218749:web:62bee8e4a7b965df260514"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
