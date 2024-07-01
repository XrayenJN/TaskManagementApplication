import React, { createContext, useState, useEffect } from 'react';
import { Security } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { toRelativeUrl } from '@okta/okta-auth-js';
import { auth, customSignIn} from '../../../server/firebase/firebase';
import axios from 'axios';

const AuthContext = createContext();

const oktaAuth = new OktaAuth({
  // Required config
  clientId: `${import.meta.env.VITE_OKTA_CLIENT_ID}`,
  issuer: `https://${import.meta.env.VITE_OKTA_DOMAIN}/oauth2/default`,
  redirectUri: `${window.location.origin}/login/callback`,
});

const restoreOriginalUri = async (_oktaAuth, originalUri) => {
  window.location.replace(toRelativeUrl(originalUri || '/', window.location.origin))
};

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkOktaAuth = async () => {
      // TODO: try-catch it later
      const tokens = await oktaAuth.tokenManager.getTokens();
      if (tokens.accessToken){
        const user = await oktaAuth.getUser();
        setUser(user);

        //connect with back-end with axios
        axios.post("http://localhost:8888/api/auth/okta", { token: tokens.accessToken })
        .then(response => {
          const firebaseToken = response.data.firebaseToken;
          return customSignIn(firebaseToken);
        })
        // The userCredential is always null
        // TODO: find a way to get the user from @firebase.js
        // and then check if the user has the email or not
        // if it has, then we don't need to have another axios connection again
        // Right now, the mechanism is still working 
        // (just small bug and it doesn't really affect the entire system)
        .then(userCredential => {
          if (!userCredential){
            // if it is undefined, then email, displayName doesn't exist yet.
            // update it using firebase admin
            const uid = tokens.accessToken.claims.uid;
            const userIdentification = {
              email: tokens.idToken.claims.email,
              emailVerified: false,
              displayName: tokens.idToken.claims.name
            }
            axios.post("http://localhost:8888/api/firebase/updateUser", 
              { uid: uid, informations: userIdentification})
              .then(response => {
                console.log("Succefully update the user account");
              })
              .catch(err => {
                console.log("Not updated");
              })
          }
          console.log('User signed in:', userCredential);
        })
        .catch(err => console.log('Error signing in:', err));
      }

    };
    checkOktaAuth();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (!user && firebaseUser) setUser(firebaseUser);
    })
    return () => unsubscribe();
  })

  return (
    <AuthContext.Provider value={{ oktaAuth, user, auth }}>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>{children}</Security>
    </AuthContext.Provider>
  )
}

export {AuthContext, AuthProvider};