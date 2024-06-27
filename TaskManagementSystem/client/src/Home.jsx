import React, { Component, useEffect } from 'react';
import { useOktaAuth, withOktaAuth } from '@okta/okta-react';
import { useHistory } from 'react-router-dom'
import './App.css';
import reactLogo from './assets/react.svg'
import { auth, googleSignIn } from '../../server/firebase/firebase';

export default function Home(){
  const history = useHistory();

  const goToLogin = () => {
    history.replace('/');
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
        <br></br>
        <button onClick={goToLogin}>Login</button>
      </header>
    </div>
  );
}