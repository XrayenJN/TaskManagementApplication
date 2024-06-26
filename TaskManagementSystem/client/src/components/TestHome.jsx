import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#F4F1E7', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Your Projects</h1>
        <button style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
          Add Project
        </button>
      </div>
      <hr style={{ margin: '20px 0', border: '1px solid #ccc' }} />

      <Link to="/project" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ backgroundColor: '#1BA098', color: 'white', padding: '20px', marginBottom: '20px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', color: 'black' }}>Project ID: Project Name</p>
              <p style={{ margin: 0, color: 'black' }}>Contributors</p>
            </div>
            <div style={{ fontWeight: 'bold', color: 'black', display: 'flex', alignItems: 'center' }}>
              End Date
            </div>
          </div>
        </div>
      </Link>

      <Link to="/project" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ backgroundColor: '#BD7676', color: 'white', padding: '20px', marginBottom: '20px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', color: 'black' }}>Project ID: Project Name</p>
              <p style={{ margin: 0, color: 'black' }}>Contributors</p>
            </div>
            <div style={{ fontWeight: 'bold', color: 'black', display: 'flex', alignItems: 'center' }}>
              End Date
            </div>
          </div>
        </div>
      </Link>

    </div>
  );
};

export default Home;