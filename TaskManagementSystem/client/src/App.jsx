import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter, useHistory } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security, SecureRoute } from '@okta/okta-react';
import Login from './Login';
import Profile from './Profile';
import TitleBar from './components/TitleBar';

const oktaAuth = new OktaAuth({
  // Required config
  clientId: `${import.meta.env.VITE_OKTA_CLIENT_ID}`,
  issuer: `https://${import.meta.env.VITE_OKTA_DOMAIN}/oauth2/default`,
  redirectUri: `${window.location.origin}/login/callback`,
});

function App() {
  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  }

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <TitleBar toggleNavbar={() => {}} />
      <Route path="/" exact={true} component={Login}/>
      <Route path="/login/callback" component={LoginCallback}/>
      <Route path="/profile" component={Profile}/>
    </Security>
  );
}

const AppWithRouterAccess = withRouter(App);

class RouterApp extends Component {
  render() {
    return (<Router><AppWithRouterAccess/></Router>);
  }
}

export default RouterApp;
