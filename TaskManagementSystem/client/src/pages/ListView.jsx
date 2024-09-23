import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TaskContext } from '../contexts/TaskContext';
import { getContributors, updateTask } from '../firebase/firebase';

const ListView = () => {
  const { projectId } = useParams();
  const { projectTasks, refreshTasks, setInViewPage } = useContext(TaskContext);
  const { setChosenProjectId } = useContext(TaskContext);
  const [chosenTaskId, setChosenTaskId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [contributors, setContributors] = useState([]);
  const [editedTask, setEditedTask] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    comments: '',
    links: '',
    isMilestone: false,
    status: null,
    owners: [],
  });

  window.addEventListener("popstate", () => {
    setInViewPage(false);
  });

  const retrieveContributors = async () => {
    const theContributors = await getContributors(projectId);
    setContributors(theContributors);
  };  

  useEffect(() => {
    retrieveContributors();
    setInViewPage(true);
    setChosenProjectId(projectId);
  }, []);

  const togglePopup = (task) => {
    setChosenTaskId(task.id);
    setEditedTask({
      name: task.name,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      comments: task.comments,
      links: task.links,
      isMilestone: task.isMilestone,
      status: task.status,
      owners: task.owners[0] ? task.owners[0].email : task.owners,
    });
    setShowPopup(!showPopup);
  };

  const handleInputChange = (e) => {
    const { type, name, checked, value } = e.target;
    setEditedTask({ ...editedTask, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async () => {
    await updateTask(chosenTaskId, editedTask);
    refreshTasks();
    setShowPopup(false);
  };

  const groupedTasks = projectTasks[projectId]?.reduce((acc, task) => {
    const dateKey = task.endDate;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);
    return acc;
  }, {});

  const tasksOutput = () => {
    if (groupedTasks) {
      return (
        <ul>
          {Object.keys(groupedTasks).map(date => (
            <li key={date} style={{ marginBottom: '30px' }}>
              <div style={{ textAlign: 'left', marginBottom: '10px', color: 'black', fontSize: '20px', fontWeight: 'bold' }}>
                <i>{date}</i>
              </div>
              {groupedTasks[date].map(task => (
                <div key={task.id} style={{ backgroundColor: '#3BAEA0', padding: '20px', cursor: 'pointer', marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ textAlign: 'left', margin: 0, fontWeight: 'bold', color: 'black', fontSize: '24px' }}>{task.name}</p>
                      <div style={{ textAlign: 'left', color: 'black' }}>
                        <div>{task.description}</div>
                        <div style={{ margin: '10px 0' }}>Contributors: <i>{task.owners.join(", ")}</i></div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => togglePopup(task)} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
                    Edit Project Details
                  </button>
                </div>
              ))}
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
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Filter</button>
          <button style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Sort By</button>
          <Link to={`/project/${projectId}/new-project-task-form`} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
            Add Project Task
          </Link>
        </div>
        <hr style={{ margin: '20px 0', border: '1px solid #ccc'}}/>
        <div>
          {tasksOutput()}
        </div>
      </div>
    </div>
  );
}

export default ListView;
