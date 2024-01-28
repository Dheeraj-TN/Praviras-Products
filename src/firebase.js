// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAUuc3_rB5HhVxMIB7TymPRNW82bl97M5Y",
  authDomain: "praviras-2da5f.firebaseapp.com",
  projectId: "praviras-2da5f",
  storageBucket: "praviras-2da5f.appspot.com",
  messagingSenderId: "164718210285",
  appId: "1:164718210285:web:8058b53ed8ae1b4a9170e4",
  measurementId: "G-251TDLK750",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
