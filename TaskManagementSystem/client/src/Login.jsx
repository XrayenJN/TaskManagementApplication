import React, { Component, useContext, useEffect } from 'react';
import { useOktaAuth, withOktaAuth } from '@okta/okta-react';
import { useHistory } from 'react-router-dom'
import './App.css';
import reactLogo from './assets/react.svg'
import { auth, googleSignIn } from '../../server/firebase/firebase';
import { AuthContext } from './AuthContext';

export default function Login(){
    const { user, oktaAuth } = useContext(AuthContext);
    const history = useHistory();
  
    const loginWithOkta = async () => {
      await oktaAuth.signInWithRedirect();
      // history.push('/profile');
    }

    const goToHome = () => {
      history.replace('/general');
    }
  
    const goToProfile = () => {
      history.push('/profile');
    }
  
    let body = null;
    if (user) {
      body = (
        <div className="Buttons">
          <button onClick={goToProfile}>Profile</button>
        </div>
      );
    } else {
      body = (
        <div className="Buttons">
          <button onClick={goToHome}>Home</button>
          <button onClick={loginWithOkta}>Okta</button>
          <button onClick={googleSignIn}>Google</button>
          {/* <button onClick={goToGoogleLogin}>Google Login</button> */}
        </div>
      );
    }
  
    return (
      <div className="App">
        <header className="App-header">
          <img src={reactLogo} className="App-logo" alt="logo"/>
          <p>
            Edit <code>src/Home.js</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          {body}
        </header>
      </div>
    );
  }