import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TaskContext } from '../contexts/TaskContext';
import { getContributors } from '../firebase/firebase';
import TaskEditPopup from './components/TaskEditPopup';

const ListView = () => {
  const { projectId } = useParams();
  const { projectTasks, refreshTasks, setInViewPage } = useContext(TaskContext);
  const { setChosenProjectId } = useContext(TaskContext);
  const [chosenTask, setChosenTask] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const retrieveContributors = async () => {
      const theContributors = await getContributors(projectId);
      setContributors(theContributors);
    };

    retrieveContributors();
    setInViewPage(true);
    setChosenProjectId(projectId);
  }, [projectId]);

  const togglePopup = (task) => {
    setChosenTask(task);
    setShowPopup(!showPopup);
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
      const sortedTaskByDates = Object.keys(groupedTasks).sort((a, b) => new Date(a) - new Date(b));
      return (
        <ul>
          {sortedTaskByDates.map((date) => (
            <li key={date} style={{ marginBottom: '30px' }}>
              <div style={{ textAlign: 'left', marginBottom: '10px', fontWeight: 'bold' }}>
                <i>{date}</i>
              </div>
              {groupedTasks[date].map((task) => (
                <div key={task.id} style={{ padding: '20px', marginTop: '15px', backgroundColor: '#3BAEA0' }}>
                  <p style={{ fontWeight: 'bold' }}>{task.name}</p>
                  <p>{task.description}</p>
                  <button onClick={() => togglePopup(task)}>Edit Project Details</button>
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
      <h1>List View</h1>
      {tasksOutput()}
      {showPopup && <TaskEditPopup task={chosenTask} contributors={contributors} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default ListView;