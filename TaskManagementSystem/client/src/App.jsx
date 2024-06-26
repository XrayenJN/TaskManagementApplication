import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar';
import TestHome from './components/TestHome';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={TestHome} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;