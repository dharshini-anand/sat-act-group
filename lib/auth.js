import { useState, useEffect, useContext, createContext } from "react";
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
import { firebaseApp, auth, db } from './firebase'

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const auth = useAuthProvider();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
class User {
  constructor (firstName, lastName) {
      this.firstName = firstName;
      this.lastName = lastName;
  }
}
const userConverter = {
  toFirestore: (user) => {
      return {
          firstName: user.firstName,
          lastName: user.lastName
      }
  },
  fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new User(data.firstName, data.lastName);
  }
}
const useAuthProvider = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          setLoading(false);
        } else {
          setUser(false);
          setLoading(false);
        }
      });
  
      return () => unsubscribe();
    }, [user]);
  
    const signIn = async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    };
  
    const signUp = async (firstName, lastName, email, password) => {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", response.user.uid), {
        uid: response.user.uid,
        first_name: firstName,
        last_name: lastName,
        email: email,
        type: "student"
      });
    };
    const signOut = async () => {
      await fSignOut(auth);
    };
    return {
      user,
      loading,
      signIn,
      signUp,
      signOut,
    };
  };


