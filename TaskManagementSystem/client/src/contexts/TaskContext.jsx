import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProjects, getUserProjectIds, getTaskDocuments } from "../firebase/firebase";
import { AuthContext } from './AuthContext';
import { ProjectContext } from './ProjectContext';

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const { projects } = useContext(ProjectContext)
  const { chosenProjectId } = useContext(ProjectContext);
  const [projectTasks, setProjectTasks] = useState({})

  useEffect(() => {
    if (projects) {
      const fetchTasks = async (projectId) => {
        const tasks = await getTaskDocuments(projectId);
        setProjectTasks(value => {
          const taskList = value[projectId] || []
          console.log(taskList)
          const updatedTaskList = [...taskList, ...tasks]
          console.log(updatedTaskList)
          return ({
            ...value,
            [projectId]: updatedTaskList
          })
        })
      }

      Object.entries(projects).map(([id, _]) => fetchTasks(id));
    }
  }, [projects])

  useEffect(() => {
    
  }, [projectTasks])

  return (
    <TaskContext.Provider value={{ projectTasks }}>
      {children}
    </TaskContext.Provider>
  )
}

export { TaskContext, TaskProvider };