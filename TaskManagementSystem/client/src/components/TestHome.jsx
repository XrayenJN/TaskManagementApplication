import React from 'react';

const Home = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#F4F1E7', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Your Projects</h1>
        <button style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
          Add Project
        </button>
      </div>
      <hr></hr>
      <p>Welcome to the Home page!</p>
    </div>
  );
};

export default Home;