import { signInWithPopup, GoogleAuthProvider, signInWithCustomToken } from "firebase/auth";
import { User } from "../models/User";
import { auth, provider } from "./firebase";
import { createUserDocument } from "./user";

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
      console.log(errorCode, errorMessage, credential);
    });

  const user = new User(userResult.displayName, userResult.email, []);
  await createUserDocument(userResult.uid, user);
};

export const customSignIn = async (token) => {
  const userResult = await signInWithCustomToken(auth, token)
    .then(async (result) => {
      const user = result.user;

      return user;
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

  const user = new User(userResult.displayName, userResult.email, []);
  await createUserDocument(userResult.uid, user);
};
