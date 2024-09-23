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
            <h1 style={{ textAlign: 'left', marginTop: '50px' }}>List View</h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Filter</button>
                <button style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Sort By</button>
                <Link to={`/project/${projectId}/new-project-task-form`} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
                    Add Project Task
                </Link>
            </div>
            <hr style={{ margin: '20px 0', border: '1px solid #ccc'}}/>
            {projectTasks.map(task => (
            <div key={task.id} style={{ marginBottom: '30px' }}>
                <div style={{ textAlign: 'left', marginBottom: '10px', color: 'black', fontSize: '20px', fontWeight: 'bold'}}>
                <i>{task.endDate}</i>
                </div>
                <div style={{ backgroundColor: '#3BAEA0', padding: '20px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                    <p style={{ textAlign: 'left', margin: 0, fontWeight: 'bold', color: 'black', fontSize: '24px' }}>{task.name}</p>
                    <div style={{ textAlign: 'left', color: 'black' }}>
                        <div>{task.description}</div>
                        <div style={{ margin: '10px 0' }}>Contributors: <i>{task.owners.join(", ")}</i> </div>
                    </div>
                    </div>
                    {/* <div>
                    <div style={{ color: 'black', fontSize: '18px' }}>
                        <Link to={`/project/${projectId}/task/${task.id}`}>
                        <div><b>Start date:</b> {task.startDate}</div>
                        <div><b>End date:</b> {task.endDate}</div>
                        </Link>
                    </div>
                    </div> */}
                </div>
                </div>
            </div>
            ))}
        </div>  
    </div>
  );
}

export default ListView;