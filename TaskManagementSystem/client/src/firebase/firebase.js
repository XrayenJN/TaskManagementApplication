// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PROJECT_ID,
  storageBucket: import.meta.env.STORAGE_BUCKET,
  messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
  appId: import.meta.env.APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
export const auth = getAuth(app);

// Firebase firestore
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export const googleSignIn = async () => {
  await signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      if (window.opener) {
        window.opener.postMessage({ user: result.user }, "*");
        window.close();
      }
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  ;
}

export const customSignIn = async (token) => {
  await signInWithCustomToken(auth, token)
    .then((result) => {
      const user = result.user;
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    })
}