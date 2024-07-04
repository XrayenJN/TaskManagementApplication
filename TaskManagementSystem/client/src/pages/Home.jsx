import React from 'react';
import { useHistory } from 'react-router-dom'
import '../assets/styles/App.css';
import reactLogo from '../assets/react.svg'

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
          General information / introduction about our application
        </p>
        <br></br>
        <button onClick={goToLogin}>Login</button>
      </header>
    </div>
  );
}