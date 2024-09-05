import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProjects, getUserProjectIds, getTaskDocuments } from "../firebase/firebase";
import { AuthContext } from './AuthContext';
import { ProjectContext } from './ProjectContext';

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const { projects } = useContext(ProjectContext);
  const [projectTasks, setProjectTasks] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Fetch tasks for all projects
  const fetchTasks = async (projectId) => {
    const tasks = await getTaskDocuments(projectId);
    setProjectTasks(prevValue => {
      const taskList = prevValue[projectId] || [];
      const updatedTaskList = [...taskList, ...tasks];
      return {
        ...prevValue,
        [projectId]: updatedTaskList,
      };
    });
  };

  // Fetch tasks when the projects change
  useEffect(() => {
    if (projects) {
      Object.entries(projects).forEach(([id, _]) => fetchTasks(id));
    }
  }, [projects]);

  // Re-fetch tasks when `projectTasks` change (you can control how often)
  useEffect(() => {
    if (refreshTrigger) {
      if (projects) {
        // refresh it again
        setProjectTasks({})
        Object.entries(projects).forEach(([id, _]) => fetchTasks(id));
      }
      // Turn off refresh trigger after fetching tasks
      setRefreshTrigger(false);
    }
  }, [projectTasks, refreshTrigger, projects]);

  // Function to manually trigger a refresh
  const refreshTasks = () => {
    setRefreshTrigger(true);
  };

  return (
    <TaskContext.Provider value={{ projectTasks, refreshTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export { TaskContext, TaskProvider };