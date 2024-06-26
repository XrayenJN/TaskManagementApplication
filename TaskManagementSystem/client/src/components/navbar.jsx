import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ width: '200px', float: 'left', height: '100vh', backgroundColor: '#33312E', padding: '20px' }}>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li><Link to="/">Home</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;