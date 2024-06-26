import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/TestHome';
import TitleBar from './components/TitleBar';

const App = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <Router>
      <div>
        <TitleBar toggleNavbar={toggleNavbar} />
        <Navbar isOpen={isNavbarOpen} />
        <div style={{ marginLeft: isNavbarOpen ? '200px' : '0', transition: 'margin-left 0.3s', marginTop: '60px', backgroundColor: '#F4F1E7', height: 'calc(100vh - 60px)' }}>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;