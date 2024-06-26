import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ isOpen }) => {
  return (
    <nav style={{ width: isOpen ? '200px' : '0', height: '100vh', backgroundColor: '#33312E', overflow: 'hidden', transition: 'width 0.3s', position: 'fixed', top: '60px', left: '0', color: 'white' }}>
      <ul style={{ listStyleType: 'none', padding: isOpen ? '20px' : '0', margin: 0 }}>
        <li style={{ display: isOpen ? 'block' : 'none', marginBottom: '15px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faHome} style={{ marginRight: '10px' }} />
            Home
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;