import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWDapaFlrhb1k8uibdkyakUyGUWBWd_CE",
  authDomain: "unihub-bc6a9.firebaseapp.com",
  projectId: "unihub-bc6a9",
  storageBucket: "unihub-bc6a9.firebasestorage.app",
  messagingSenderId: "163272607869",
  appId: "1:163272607869:web:ac01f7192a94ad3c1a8914",
  measurementId: "G-WK6KDC48JY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();