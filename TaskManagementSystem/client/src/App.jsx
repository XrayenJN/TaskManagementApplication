import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter, useHistory, Switch } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security, SecureRoute } from '@okta/okta-react';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/general" exact={true} component={Home}/>
        <AuthProvider>
          <Route path="/" exact={true} component={Login}/>
          <Route path="/login/callback" component={LoginCallback}/>
          <Route path="/profile" component={Profile}/>
        </AuthProvider>
      </Switch>
    </Router>
  );
}

const AppWithRouterAccess = withRouter(App);

class RouterApp extends Component {
  render() {
    return (<Router><AppWithRouterAccess/></Router>);
  }
}

export default RouterApp;
