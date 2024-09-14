import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../assets/styles/App.css';
import Slideshow from '../../components/Slideshow';
import { AuthContext } from '../../contexts/AuthContext';
import { googleSignIn } from '../../firebase/firebase';


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
        <Slideshow />
        <p>Be more productive. Be more organised. Be more coordinated.</p>
        <p>Start your project journey here.</p>
        <hr></hr>
        <br></br>
        <div className="Buttons">
          <button onClick={loginWithOkta}>Login With Okta</button>
          <button onClick={googleSignIn}>Login With Google</button>
        </div>
      </header>
    </div>
  );
}