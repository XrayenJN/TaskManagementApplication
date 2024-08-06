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
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [contributors, setContributors] = useState([]);

  const fetchContributors = async (projectId) => {
    const theContributors = await getContributors(projectId);
    setContributors(theContributors);
  };

  const togglePopup = (projectId) => {
    setShowPopup(!showPopup);
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
    setShowPopup(false);
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

  const showEditProjectButton = (project) => {
    return (
      <div>
        <button onClick={() => togglePopup(project.id)} style={{ backgroundColor: '#DEB992', color: 'black', padding: '5px 10px', cursor: 'pointer', borderRadius: '0' }}>Edit Project Details</button>
          {showPopup && (
            <div className="popup">
              <div className="popup-content" style={{backgroundColor: '#DEB992'}}>
                <h2>Edit Project Details</h2>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter contributor email"
                />
                  <button onClick={handleEmailCheck}>Check</button>
                  {isEmailValid && <button onClick={handleEmailSubmit}>Submit</button>}
                <div><button onClick={togglePopup}>Close</button></div>
              </div>
            </div>
          )}
      </div>
    );
  };  

  // use this to update the userId
  // idk why, without this, the hook doesn't work for the setUserId...
  useEffect(() => {
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

  useEffect(() => {
      projects.forEach(project => {
          fetchContributors(project.id);
      });
    }, [projects]);

  if (loading) {
    /**
     * @todo Ethan said: the return statement is too long and needs to be cleaned up
     */
    return <div>Loading...</div>;
  }

  /*
  Todo make this smaller with the use of a sorting function
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
        const backgroundColor = isExpired(project.endDate) ? '#BD7676' : '#1BA098';

        return (
          <div style={{ backgroundColor, padding: '20px', marginBottom: '20px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ textAlign: 'left', margin: 0, fontWeight: 'bold', color: 'black' , fontSize: '24px' }}>{project.name}</p>
                <div style={{textAlign: 'left', color: 'black'}}>
                  <div>{project.description}</div>
                  <div style={{margin: '10px 0'}}>Contributors: <i>{contributors.join(', ')}</i> </div>
                </div>
              </div>
              <div>
                <div style={{ color: 'black', fontSize: '18px' }}>
                  <div><b>Start date:</b> {project.startDate}</div>
                  <div><b>End date:</b> {project.endDate}</div>
                </div>
                <div style={{margin: '15px 0', textAlign: 'right'}}>
                  {showEditProjectButton(project)}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default ProjectList;