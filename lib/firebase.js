import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fSignOut,
  sendPasswordResetEmail as fSendPasswordResetEmail,
  confirmPasswordReset as fConfirmPasswordReset,
} from "firebase/auth";
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    setDoc,
    Timestamp,
} from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyBYdDunH7nka-6kCwpopSSLUYaRicx8fm4",
    authDomain: "sat-act-798dc.firebaseapp.com",
    databaseURL: "https://sat-act-798dc-default-rtdb.firebaseio.com",
    projectId: "sat-act-798dc",
    storageBucket: "sat-act-798dc.appspot.com",
    messagingSenderId: "470683006115",
    appId: "1:470683006115:web:1c94981be4a9aff0acbb16",
    measurementId: "G-M3PNHBKKSF"
  };

let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
}
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
export { firebaseApp, auth, db }
