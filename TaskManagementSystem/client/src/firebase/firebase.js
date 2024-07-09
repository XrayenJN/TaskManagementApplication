// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithCustomToken } from "firebase/auth";
import { doc, setDoc, getFirestore, collection, addDoc } from "firebase/firestore";
import { User, userConverter } from "../models/User";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
export const auth = getAuth(app);

// Firebase firestore
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// Handling with sign in process
export const googleSignIn = async () => {
  const userResult = await signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      if (window.opener) {
        window.opener.postMessage({ user: result.user }, "*");
        window.close();
      }
      
      // The signed-in user info.
      return result.user;

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    });

  const user = new User(userResult.displayName, userResult.email);
  await createUserDocument(userResult.uid, user);
}

export const customSignIn = async (token) => {
  const userResult = await signInWithCustomToken(auth, token)
    .then(async (result) => {
      const user = result.user;

      console.log(user);
      return user;
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });

  const user = new User(userResult.displayName, userResult.email);
  await createUserDocument(userResult.uid, user);
}

// Handling with firestore
const createUserDocument = async(uid, user) => {
  const ref = doc(db, "users", uid).withConverter(userConverter);
  await setDoc(ref, user);
}