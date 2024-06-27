// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithCustomToken } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "task-management-system-cs-01.firebaseapp.com",
  projectId: "task-management-system-cs-01",
  storageBucket: "task-management-system-cs-01.appspot.com",
  messagingSenderId: "438150743957",
  appId: "1:438150743957:web:ded891ce2568435001989c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const googleSignIn = async () => {
  await signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      // console.log(user)
      // console.log(token)
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
      // ...
      // console.log(errorCode);
      // console.log(errorMessage);
    });
  ;
}

export const customSignIn = async (token) => {
  await signInWithCustomToken(auth, token)
    .then((result) => {
      const user = result.user;
      console.log(user);
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode, errorMessage);
    })
}