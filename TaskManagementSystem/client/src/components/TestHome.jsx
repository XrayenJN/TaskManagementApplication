import React from 'react';

const Home = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#F4F1E7', height: '100%' }}>
      <h1>Your Projects</h1>
      <hr style={{ margin: '20px 0', border: '1px solid #ccc' }} />

      <div style={{ backgroundColor: '#1BA098', color: 'black', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Project ID: Project Name</p>
            <p style={{ margin: 0 }}>Contributors</p>
          </div>
          <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            End Date
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#BD7676', color: 'black', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Project ID: Project Name</p>
            <p style={{ margin: 0 }}>Contributors</p>
          </div>
          <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            End Date
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;