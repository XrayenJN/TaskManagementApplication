import React, { Component, useEffect } from 'react';
import { useOktaAuth, withOktaAuth } from '@okta/okta-react';
import { useHistory } from 'react-router-dom'
import './App.css';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

export default function Home(){
  const { authState, oktaAuth } = useOktaAuth();
  const history = useHistory();

  const login = async () => {
    await oktaAuth.signInWithRedirect();

  }

  const logout = async () => {
    await oktaAuth.signOut();
  }

  const goToProfile = () => {
    history.push('/profile');
  }

  let body = null;
    if (authState?.isAuthenticated) {
      body = (
        <div className="Buttons">
          <button onClick={goToProfile}>Profile</button>
          <button onClick={logout}>Logout</button>
          {/* Replace me with your root component. */}
        </div>
      );
    } else {
      body = (
        <div className="Buttons">
          <button onClick={login}>Login with Okta</button>
        </div>
      );
    }

  useEffect(() => {
    if (authState?.isAuthenticated){
        const oktaToken = oktaAuth.getUser().then((info) => {
          console.log(info);
        })
    }
  })

  return (
    <div className="App">
      <header className="App-header">
        <p>Be more productive. Be more organised. Be more coordinated.</p>
        <p>Start your project journey here.</p>
        <hr></hr>
        <br></br>
        {body}
      </header>
    </div>
  );
}