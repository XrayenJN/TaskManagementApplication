import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter, Switch } from 'react-router-dom';
import { LoginCallback } from '@okta/okta-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProjectList from './pages/ProjectList';
import NewProjectForm from './pages/NewProjectForm';
import TitleBar from './components/TitleBar';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import ListView from './pages/ListView';
import NewProjectTaskForm from './pages/NewProjectTaskForm';

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
          <PrivateRoute path="/new-project-form" component={NewProjectForm}/>
          <PrivateRoute path="/projects" component={ProjectList} />
          <PrivateRoute path="/project/:projectId" exact={true} component={ListView} />
          <PrivateRoute path="/project/:projectId/new-project-task-form" component={NewProjectTaskForm} />
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
