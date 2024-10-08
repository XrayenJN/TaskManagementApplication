import { LoginCallback } from '@okta/okta-react';
import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';
import TitleBar from './components/TitleBar';
import { AuthProvider } from './contexts/AuthContext';
import ListView from './pages/HomePage/TaskViews/ListView/ListView';
import KanbanView from './pages/HomePage/TaskViews/KanBanBoardView/KanBanBoard';
import CalendarView from './pages/HomePage/TaskViews/CalenderView/CalenderView';
import NewProjectTaskForm from './pages/NewProjectTaskForm';
import NewProjectForm from './pages/HomePage/NewProjectForm';
import ProjectList from './pages/HomePage/HomeView';
import Login from './pages/Login/Login';
import Profile from './pages/Debugging/Profile';
import PrivateRoute from './routes/PrivateRoute';
import Settings from './pages/Settings';
import { ProjectProvider } from './contexts/ProjectContext';
import { TaskProvider } from './contexts/TaskContext';
import GanttChart from './pages/HomePage/TaskViews/GanttView/TimelineView';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  return (
    <Router>
      <Switch>
        <AuthProvider>
          <SettingsProvider>
            <Route path="/" exact={true} component={Login}/>
            <Route path="/login/callback" component={LoginCallback}/>
            <PrivateRoute path="/profile" component={Profile}/>
            <Route path="/settings" component={Settings} />
            <ProjectProvider>
              <PrivateRoute path="/projects" component={ProjectList} />
              <PrivateRoute path="/new-project-form" component={NewProjectForm}/>
              <TaskProvider>
                <TitleBar toggleNavbar={() => {}} />
                <PrivateRoute path="/project/:projectId/timeline" exact={true} component={GanttChart} />
                <PrivateRoute path="/project/:projectId/" exact={true} component={ListView} />
                <Route path="/project/:projectId/kanban" component={KanbanView} />
                <Route path="/project/:projectId/calendar" component={CalendarView} />
                <PrivateRoute path="/project/:projectId/new-project-task-form" component={NewProjectTaskForm} />
              </TaskProvider>
            </ProjectProvider>
          </SettingsProvider>
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
