import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProjects, getUserProjectIds, getContributors } from "../firebase/firebase";
import { AuthContext } from './AuthContext';

const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState({});
  const [chosenProjectId, setChosenProjectId] = useState({});
  const [contributors, setContributors] = useState({});

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

  useEffect(() => {
    const fetchContributors = async (projectId) => {
      const theContributors = await getContributors(projectId);
      setContributors(value => ({...value, [projectId]:theContributors}));
    };

    Object.entries(projects).map(([id, _]) => fetchContributors(id))
  }, [projects])

  if (!user) return null;
  return (
    <ProjectContext.Provider value={{ projects, chosenProjectId, contributors, setChosenProjectId }}>
      {children}
    </ProjectContext.Provider>
  )
}

export { ProjectContext, ProjectProvider };