import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const TitleBar = ({ toggleNavbar }) => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ backgroundColor: '#051622', color: '#fff', display: 'flex', alignItems: 'center', padding: '10px 20px', position: 'fixed', width: '100%', top: 0, left: 0, zIndex: 1 }}>
      <h1 style={{ margin: 0, textAlign: 'center', flex: 1 }}>Task Management System</h1>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}>
          <FontAwesomeIcon
            icon={faUser}
            style={{ fontSize: '30px', marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '10px' }}>{user.displayName}</span>
        </div>
      )}
    </div>
  );
};

export default TitleBar;