import React, { useState } from 'react';

const TitleBar = ({ toggleNavbar }) => {
  return (
    <div style={{ backgroundColor: '#051622', color: '#fff', display: 'flex', alignItems: 'center', padding: '10px 20px', position: 'fixed', width: '100%', top: 0, left: 0, zIndex: 1 }}>
      <h1 style={{ margin: 0, textAlign: 'center', flex: 1 }}>Task Management System</h1>
    </div>
  );
};

export default TitleBar;