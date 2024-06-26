import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter, useHistory } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security, SecureRoute } from '@okta/okta-react';
import Home from './Home';
import Profile from './Profile';

const oktaAuth = new OktaAuth({
  // Required config
  clientId: `${'0oahy8lw301q7WxSP5d7'}`,
  issuer: `https://${"dev-20185654.okta.com"}/oauth2/default`,
  redirectUri: `${window.location.origin}/login/callback`,
});

function App() {
  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  }

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Route path="/" exact={true} component={Home}/>
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
