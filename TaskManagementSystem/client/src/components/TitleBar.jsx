import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const TitleBar = ({ toggleNavbar }) => {
  const { user } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div style={{ backgroundColor: '#051622', color: '#fff', display: 'flex', alignItems: 'center', padding: '10px 20px', position: 'fixed', width: '100%', top: 0, left: 0, zIndex: 1 }}>
      <h1 style={{ margin: 0, textAlign: 'center', flex: 1 }}>Task Management System</h1>
      {user && (
        <div 
          style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}
          onMouseEnter={handleDropdownToggle}
          onMouseLeave={handleMouseLeave}
        >
          <FontAwesomeIcon
            icon={faUser}
            style={{ fontSize: '30px', marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '10px' }}>{user.displayName}</span>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '53px',
              right: '10px',
              backgroundColor: '#051622',
              borderRadius: '5px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              marginRight: '50px',
            }}>
              <ul style={{
                listStyle: 'none',
                margin: 0,
                padding: '20px',
                color: '#fff',
              }}>
                <li style={{ padding: '5px 10px', cursor: 'pointer' }}>Profile</li>
                <li style={{ padding: '5px 10px', cursor: 'pointer' }}>Settings</li>
                <hr></hr>
                <li style={{ padding: '5px 10px', cursor: 'pointer' }}>Log Out</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TitleBar;