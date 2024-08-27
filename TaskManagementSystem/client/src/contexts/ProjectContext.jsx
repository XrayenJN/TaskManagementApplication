import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProjects, getUserProjectIds } from "../firebase/firebase";
import { AuthContext } from './AuthContext';

const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState({});
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      if (user){
        const userProjectIds = await getUserProjectIds(user.uid);
        const projects = await getProjects(userProjectIds);
        projects.forEach(project => setProjects(value => ({...value, [project.id]: project})))
      }
    };

    fetchProjects();
  }, [user])

  if (!user) return null;
  return (
    <ProjectContext.Provider value={{ projects, tasks, setProjects, setTasks }}>
      {children}
    </ProjectContext.Provider>
  )
}

export { ProjectContext, ProjectProvider };