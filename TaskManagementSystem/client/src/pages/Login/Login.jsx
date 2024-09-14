import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../assets/styles/App.css';
import Slideshow from '../../components/Slideshow';
import { AuthContext } from '../../contexts/AuthContext';
import { googleSignIn } from '../../firebase/firebase';

import landingSplashVideo from '../../assets/Task Management System - Landing Splash.mp4';
import oktaLogo from '../../assets/images/okta-logo.png';
import googleLogo from '../../assets/images/google-logo.png';


export default function Login(){
  const { user, oktaAuth, auth } = useContext(AuthContext);
  const history = useHistory();

  const loginWithOkta = async () => {
    await oktaAuth.signInWithRedirect();
  }

  useEffect(() => {
    if (user) {
      history.push('/projects');
    }
  }, [user, history]);

  return (
    <div className="App">
      <header className="App-header">
      <video
          src={landingSplashVideo}
          autoPlay
          muted
          playsInline
          style={{ maxWidth: '100vh', height: 'auto' }}
        />
        <br /><br />
        <Slideshow />
        <p>Be more productive. Be more organised. Be more coordinated.</p>
        <p>Start your project journey here.</p>
        <hr></hr>
        <br></br>
        <div className="Buttons">
          <button onClick={loginWithOkta}>Login with
            <img src={oktaLogo} alt="Okta Login" style={{ height: '24px', padding: '0px 0px 0px 6px' }} />
          </button>
          <button onClick={googleSignIn}>Login with
            <img src={googleLogo} alt="Google Login" style={{ height: '24px', padding: '0px 0px 0px 6px' }} />
          </button>
        </div>
      </header>
    </div>
  );
}