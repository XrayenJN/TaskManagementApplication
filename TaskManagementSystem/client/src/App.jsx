import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter, Switch } from 'react-router-dom';
import { LoginCallback } from '@okta/okta-react';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import TitleBar from './components/TitleBar';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <Router>
      <TitleBar toggleNavbar={() => {}} />
      <Switch>
        <Route path="/general" component={Home}/>
        <AuthProvider>
          <Route path="/" exact={true} component={Login}/>
          <Route path="/login/callback" component={LoginCallback}/>
          <PrivateRoute path="/profile" component={Profile}/>
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
