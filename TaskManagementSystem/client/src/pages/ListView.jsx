import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { getTaskDocuments } from '../firebase/firebase';
import { TaskContext } from '../contexts/TaskContext';

const ListView = () => {
  const { projectId } = useParams();
  const { projectTasks } = useContext(TaskContext)
  // const [projectTasks, setProjectTasks] = useState([]);

  // const fetchTasks = async () => {
  //   const tasks = await getTaskDocuments(projectId);
  //   setProjectTasks(tasks);
  // }

  // fetchTasks();

  const tasksOutput = () => {
    if (projectTasks && projectTasks[projectId]) {
      return (
        <ul>
          {projectTasks[projectId].map(task => (
            <li key={task.id}>
              Name: {task.name} - Desc: {task.description}
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div>
      <div>
        <h1>Project Task List</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to={`/project/${projectId}/new-project-task-form`} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
            Add Project Task
          </Link>
        </div>
        <div>
          {tasksOutput()}
        </div>
      </div>  
    </div>
  );
}

export default ListView;