import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom'
import './App.css';
import { googleSignIn } from '../../../server/firebase/firebase';
import { AuthContext } from '../contexts/AuthContext';


export default function Login(){
  const { user, oktaAuth } = useContext(AuthContext);
  const history = useHistory();

  const loginWithOkta = async () => {
    await oktaAuth.signInWithRedirect();
  }

  const logout = async () => {
    await oktaAuth.signOut();
  }

  const goToProfile = () => {
    history.push('/profile');
  }

  const goToInformation = () => {
    history.replace('/general');
  }

  const goToTestHome = () => {
    history.push('./TestHome')
  }

  let body = null;
  if (user) {
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
        <button onClick={goToInformation}>Information about this Website</button>
        <button onClick={loginWithOkta}>Login With Okta</button>
        <button onClick={googleSignIn}>Login With Google</button>
        <button onClick={goToTestHome}>Login with Test User</button>
      </div>
    );
  }

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