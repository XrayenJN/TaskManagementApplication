import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom'
import '../assets/styles/App.css';
import { googleSignIn } from '../../../server/firebase/firebase';
import { AuthContext } from '../contexts/AuthContext';
import Slideshow from '../components/Slideshow';


export default function Login(){
  const { user, oktaAuth, auth } = useContext(AuthContext);
  const history = useHistory();

  const loginWithOkta = async () => {
    await oktaAuth.signInWithRedirect();
  }

  const logout = async () => {
    await oktaAuth.signOut();
    await auth.signOut();;
  }

  const goToProfile = () => {
    history.push('/profile');
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
        <button onClick={loginWithOkta}>Login With Okta</button>
        <button onClick={googleSignIn}>Login With Google</button>
        <button onClick={goToTestHome}>Login with Test User</button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <Slideshow />
        <p>Be more productive. Be more organised. Be more coordinated.</p>
        <p>Start your project journey here.</p>
        <hr></hr>
        <br></br>
        {body}
      </header>
    </div>
  );
}