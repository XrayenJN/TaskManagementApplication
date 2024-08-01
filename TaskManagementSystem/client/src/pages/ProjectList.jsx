import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { checkUsersExists, getContributors, getProjects, getUserProjectIds, updateProjectContributors, updateUserProject } from '../firebase/firebase';
import { AuthContext } from '../contexts/AuthContext';
import { isExpired } from '../utils/dateHandler';

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

  const showContributorsButton = (project) => {
    return (
      <div>
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
              <button onClick={() => togglePopup(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const showInvitationEmailButton = (project) => {
    return (
      <div>
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
      </div>
    );
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
      
      // Funtions that used to sort project list
      const projectsSortedByEndDate = projects.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
      setProjects(projectsSortedByEndDate);
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

  /*
  Todo make this smaller with the use of a sorting fuction and changing the background colour to use a ternary statement
  */
  return (
    <div style={{ padding: '20px', backgroundColor: '#F4F1E7', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Projects</h1>
        <Link to="/new-project-form" style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
          Add Project
        </Link>
      </div>
      <hr style={{ margin: '20px 0', border: '1px solid #ccc' }} />
      {projects.map(project => {
        if (!isExpired(project.endDate)) return (
          // <Link to="/project" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: '#1BA098', color: 'white', padding: '20px', marginBottom: '20px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', color: 'black' }}>{project.name}: {project.description} </p>
                  {showContributorsButton(project)}
                  {showInvitationEmailButton(project)}
                </div>
                <div style={{ fontWeight: 'bold', color: 'black', display: 'flex', alignItems: 'center' }}>
                  End date: {project.endDate}
                </div>
              </div>
            </div>
          // </Link>
        )
      })}
      {projects.map(project => {
        if (isExpired(project.endDate)) return (
          // <Link to="/project" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: '#BD7676', color: 'white', padding: '20px', marginBottom: '20px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', color: 'black' }}>{project.name}: {project.description} </p>
                  {showContributorsButton(project)}
                  {showInvitationEmailButton(project)}
                </div>
                <div style={{ fontWeight: 'bold', color: 'black', display: 'flex', alignItems: 'center' }}>
                  End date: {project.endDate}
                </div>
              </div>
            </div>
          // </Link>
        )
      })}
    </div>
  );
}

export default ProjectList;