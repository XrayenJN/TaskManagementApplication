import React, { Component } from 'react';
import { useOktaAuth, withOktaAuth } from '@okta/okta-react';
import { useHistory } from 'react-router-dom'
import './App.css';
import reactLogo from './assets/react.svg'

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
          <button onClick={login}>Login</button>
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