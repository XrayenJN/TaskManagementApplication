import React, { createContext, useState, useEffect, useContext } from 'react';
import { Security } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { toRelativeUrl } from '@okta/okta-auth-js';
import { auth, customSignIn } from '../../server/firebase/firebase';
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
          // console.log(firebaseToken)
          return customSignIn(firebaseToken);
        })
        .then(userCredential => {
          console.log('User signed in:', userCredential);
        })
        .catch(err => console.log('Error signing in:', err));
      }
    };
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) setUser(firebaseUser);
    })

    checkOktaAuth();
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ oktaAuth, user, auth }}>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>{children}</Security>
    </AuthContext.Provider>
  )
}

export {AuthContext, AuthProvider};