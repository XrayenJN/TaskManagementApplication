import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { getTaskDocuments } from '../firebase/firebase';

const ListView = () => {
  const { user } = useContext(AuthContext);
  const { projectId } = useParams();
  const [projectTasks, setProjectTasks] = useState([]);

  const fetchTasks = async () => {
    const tasks = await getTaskDocuments(projectId);
    setProjectTasks(tasks);
  }

  fetchTasks();

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
          {projectTasks.map(task => (
          <li key={task.id}>
            Name: {task.name} - Desc:{task.description}
          </li>
          ))}
        </ul>
      </div>  
    </div>
  );
}

export default ListView;