import React, { createContext, useState, useEffect, useContext } from 'react';
import { Security, useOktaAuth } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { auth } from '../../server/firebase/firebase';

const AuthContext = createContext();

const oktaAuth = new OktaAuth({
  // Required config
  clientId: `${import.meta.env.VITE_OKTA_CLIENT_ID}`,
  issuer: `https://${import.meta.env.VITE_OKTA_DOMAIN}/oauth2/default`,
  redirectUri: `${window.location.origin}/login/callback`,
});

const restoreOriginalUri = async (oktaAuth, originalUri) => {
  history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
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