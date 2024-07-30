import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { checkUsersExists, getContributors, getProjects, getUserProjectIds, updateProjectContributors, updateUserProject } from '../firebase/firebase';
import { AuthContext } from '../contexts/AuthContext';

const ProjectList = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [contributors, setContributors] = useState([]);

  const togglePopup = async (projectId) => {
    setShowPopup(!showPopup);
    // console.log(projectId);
    const theContributors = await getContributors(projectId);
    console.log(theContributors);
    setContributors(theContributors);
  };

  const toggleEmailPopup = (projectId) => {
    setShowEmailPopup(!showEmailPopup);
    setIsEmailValid(false);
    setEmail('');
    setProjectId(projectId);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailValid(false);
  };

  const handleEmailSubmit = async () => {
    alert(`Email submitted: ${email}`);
    await updateProjectContributors(projectId, userId);
    await updateUserProject(userId, projectId);
    setEmail('');
    setShowEmailPopup(false);
  };

  const handleEmailCheck = async () => {
    const result = await checkUsersExists(email);
    // @todo: refactor it later, if we have time
    if (result.length > 0) {
      setUserId(result[0].userId);
      setIsEmailValid(true);
    } else {
      alert('Please enter a valid email.');
      setIsEmailValid(false);
    }
  };

  // use this to update the userId
  // idk why, without this, the hook doesn't work for the setUserId...
  useEffect(() => {
    // console.log('Will Updated userId:', userId);
  }, [userId]);

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
            <button onClick={() => togglePopup(project.id)}>Show Names</button>
              {showPopup && (
                <div className="popup">
                  <div className="popup-content">
                    <h2>Names List</h2>
                    <ul>
                      {contributors.map((name, index) => (
                        <li key={index}>{name}</li>
                      ))}
                    </ul>
                    <button onClick={togglePopup}>Close</button>
                  </div>
                </div>
              )}

            <button onClick={() => toggleEmailPopup(project.id)}>Enter Email</button>
              {showEmailPopup && (
                <div className="popup">
                  <div className="popup-content">
                    <h2>Enter Email</h2>
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                    />
                    <div>
                      <button onClick={handleEmailCheck}>Check</button>
                      {isEmailValid && <button onClick={handleEmailSubmit}>Submit</button>}
                    </div>
                    <button onClick={toggleEmailPopup}>Close</button>
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