import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const TitleBar = ({ toggleNavbar }) => {
  return (
    <div style={{ backgroundColor: '#051622', color: '#fff', display: 'flex', alignItems: 'center', padding: '10px 20px', position: 'fixed', width: '100%', top: 0, left: 0, zIndex: 1 }}>
      <div style={{ cursor: 'pointer' }} onClick={toggleNavbar}>
        &#9776;
      </div>
      <h1 style={{ margin: 0, textAlign: 'center', flex: 1 }}>Task Management System</h1>
      <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center', paddingRight: '20px' }}>
        <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
        <span>Tim Apple</span>
      </div>
    </div>
  );
};

export default TitleBar;