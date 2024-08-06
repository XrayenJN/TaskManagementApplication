import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';

const ListView = () => {
  const { user } = useContext(AuthContext);
  const { projectId } = useParams();

  const items = [
    { id: 1, name: 'Apple', price: 1.5 },
    { id: 2, name: 'Banana', price: 1.0 },
    { id: 3, name: 'Cherry', price: 2.0 },
  ];

  return (
    <div>
      <div>
        <h1>Project Task List</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to={`/project/${projectId}/new-project-task-form`} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
            Add Project Task
          </Link>
        </div>
        <ul>
          {items.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price.toFixed(2)}
          </li>
          ))}
        </ul>
      </div>  
    </div>
  );
}

export default ListView;