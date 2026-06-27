import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAw-fYltWtcZo1Ys2NPjPCsQuoW7j3ANxY",
  authDomain: "partner-orthomar-payment.firebaseapp.com",
  projectId: "partner-orthomar-payment",
  storageBucket: "partner-orthomar-payment.firebasestorage.app",
  messagingSenderId: "90804640586",
  appId: "1:90804640586:web:f47cbb9936efe0a47fbfb3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();