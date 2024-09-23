import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProjects, getUserProjectIds, getContributors } from "../firebase/firebase";
import { AuthContext } from './AuthContext';

const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [chosenProjectId, setChosenProjectId] = useState("");
  const [allProjectContributors, setAllProjectContributors] = useState({});

  const fetchProjects = async () => {
    if (user){
      const userProjectIds = await getUserProjectIds(user.uid);
      const projects = await getProjects(userProjectIds);
      setProjects({}) // reset it back
      setAllProjectContributors({})
      projects.forEach(project => setProjects(value => ({...value, [project.id]: project})))
    }
  };

  const fetchContributors = async (projectId) => {
    const theContributors = await getContributors(projectId);
    setAllProjectContributors(value => ({...value, [projectId]:theContributors}));
  };

  useEffect(() => {
    fetchProjects();
  }, [user, refreshTrigger])

  useEffect(() => {
    Object.entries(projects).map(([id, _]) => fetchContributors(id))
  }, [projects])

  useEffect(() => {
    if (refreshTrigger){
      fetchProjects();
      Object.entries(projects).map(([id, _]) => fetchContributors(id))
      setRefreshTrigger(false)
    }
  }, [refreshTrigger])

  if (!user) return null;
  return (
    <ProjectContext.Provider value={{ projects, chosenProjectId, allProjectContributors, setChosenProjectId, setRefreshTrigger }}>
      {children}
    </ProjectContext.Provider>
  )
}

export { ProjectContext, ProjectProvider };