import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../assets/styles/App.css';
import '../../assets/styles/Login.css';
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
    /* Background circles: https://codepen.io/vaibhavarora/pen/xmpxjp */
    <div className="App body-login">
      <div className="circle xxlarge shade1"></div>
      <div className="circle xlarge shade2"></div>
      <div className="circle large shade3"></div>
      <div className="circle medium shade4"></div>
      <div className="circle small shade5"></div>

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
        <p><b>Be more productive. Be more organised. Be more coordinated.</b></p>
        <br />
        <div className="Buttons">
          <button onClick={loginWithOkta}>Login with
            <img src={oktaLogo} alt="Okta Login" style={{ height: '24px', padding: '0px 0px 0px 6px' }} />
          </button>
          <button onClick={googleSignIn}>Login with
            <img src={googleLogo} alt="Google Login" style={{ height: '24px', padding: '0px 0px 0px 6px' }} />
          </button>
        </div>
      </header>

      <footer style={{ position: 'absolute', bottom: '0px', width: '100%' }}>
        <p>© 2024 S1_CS_01 - Ethan Fernandez (31558445), Libin Yang (31379788), John Bui (30566495), Jordan Nathanael (31893902)</p>
      </footer>
    </div>
  );
}