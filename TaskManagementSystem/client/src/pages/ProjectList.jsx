import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { getProjects, getUserProjectIds } from '../firebase/firebase';
import { AuthContext } from '../contexts/AuthContext';

const ProjectList = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const names = ['Alice', 'Bob', 'Charlie', 'David'];

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const userProjectIds = await getUserProjectIds(user.uid);
      const projects = await getProjects(userProjectIds);
      setProjects(projects);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) {
    /**
     * @todo Ethan said: the return statement is too long and needs to be cleaned up
     */
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Projects</h1>
      <div className="Buttons">
        <Link to="/new-project-form">
          <button>+ Project</button>
        </Link>
        <Link to="/">
          <button>Home</button>
        </Link>
      </div>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <button onClick={togglePopup}>Show Names</button>
              {showPopup && (
                <div className="popup">
                  <div className="popup-content">
                    <h2>Names List</h2>
                    <ul>
                      {names.map((name, index) => (
                        <li key={index}>{name}</li>
                      ))}
                    </ul>
                    <button onClick={togglePopup}>Close</button>
                  </div>
                </div>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;