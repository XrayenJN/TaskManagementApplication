import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const TitleBar = ({ toggleNavbar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div style={{ backgroundColor: '#051622', color: '#fff', display: 'flex', alignItems: 'center', padding: '10px 20px', position: 'fixed', width: '100%', top: 0, left: 0, zIndex: 1 }}>
      <div style={{ cursor: 'pointer' }} onClick={toggleNavbar}>
        &#9776;
      </div>
      <h1 style={{ margin: 0, textAlign: 'center', flex: 1 }}>Task Management System</h1>
      <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div onMouseEnter={toggleDropdown} onMouseLeave={closeDropdown} style={{ cursor: 'pointer', paddingRight: '20px' }}>
          <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
          <span>Tim Apple</span>
          {isDropdownOpen && (
            <div style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: '#051622', color: 'white', minWidth: '120px', padding: '10px', zIndex: 2 }}>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li onClick={closeDropdown} style={{ cursor: 'pointer' }}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleBar;