import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { checkUsersExists, getUser, updateProject, removeProjectWithAllTasks } from '../../firebase/firebase';
import { isExpired } from '../../utils/dateHandler';
import { ProjectContext } from '../../contexts/ProjectContext';
import { projectListSortedByEndDate, reverseDictionary } from '../../utils/projectSorting';

const ProjectList = () => {
  const { projects, setChosenProjectId, allProjectContributors, setRefreshTrigger } = useContext(ProjectContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState('');
  const [contributors, setContributors] = useState([]);
  const [editedProject, setEditedProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    contributors: []
  });

  const retrieveContributors = async (contributors) => {
    contributors.forEach(contributor => 
      retrieveContributorDetails(contributor)
    )
  }

  const retrieveContributorDetails = async (contributorRef) => {
    const theContributors = await getUser(contributorRef);
    setContributors(value => [...value, theContributors])
  }

  const togglePopup = (project) => {
    setShowPopup(!showPopup);
    setIsEmailValid(false);
    setEmail('');
    setProjectId(project.id);
    setContributors([]); // reset it again
    retrieveContributors(project.contributors)
    setEditedProject({
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      contributors: contributors.map(contributor => contributor.email)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject({ ...editedProject, [name]: value });
  };

  const handleSave = async () => {
    if (contributors.length > 0){
      await updateProject(projectId, editedProject);
      setRefreshTrigger(true)
      setShowPopup(false);
      return;
    }
    // otherwise just remove all the task that we have within in
    removeProjectWithAllTasks(projectId)
    setRefreshTrigger(true);
    setShowPopup(false);
  };

  const handleClose = async () => {
    setRefreshTrigger(true);
    setShowPopup(false);
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailValid(false);
  };

  const handleAddContributor = async () => {
    const result = await checkUsersExists(email);
    // @todo: refactor it later, if we have time
    if (result.length > 0) {
      setIsEmailValid(true);
      const user = result[0]
      // await updateProjectContributors(projectId, user.userId);
      // const newUserRef = await updateUserProject(user.userId, projectId);
      // const newUserDetails = await getUser(newUserRef)
      alert('The email is valid');
      setContributors(value => [...value, user])
      setRefreshTrigger(true);
      setEmail('');
    } else {
      alert('Please enter a valid email.');
      setIsEmailValid(false);
    }
  }

  const handleRemoveContributor = async (contributorEmail) => {
    const filteredContributors = contributors.filter(email => email !== contributorEmail);
    setContributors(filteredContributors)
  }

  const showEditProjectButton = (project) => {
    return (
      <div>
        <button onClick={() => togglePopup(project)} style={{ backgroundColor: '#DEB992', color: 'black', padding: '5px 10px', cursor: 'pointer', borderRadius: '0' }}>Edit Project Details</button>
        {showPopup && (
          <div className="popup">
            <div className="popup-content" style={{ backgroundColor: '#DEB992' }}>
              <h2>Edit Project Details</h2>
              <hr />
              
              <div>
                <table style={{ margin: 'auto' }}>
                  <tbody>
                    <tr>
                      <td>
                        <div>
                          <h3><u>Project Name</u></h3>
                          <input
                            type="text"
                            name="name"
                            value={editedProject.name}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <h3><u>Project Description</u></h3>
                          <textarea
                            name="description"
                            style={{ color: 'black'}}
                            value={editedProject.description}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <table style={{ margin: 'auto' }}>
                            <thead>
                              <tr>
                                <th><h3><u>Start Date</u></h3></th>
                                <th><h3><u>End Date</u></h3></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <input
                                    type="date"
                                    name="startDate"
                                    value={editedProject.startDate}
                                    onChange={handleInputChange}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="date"
                                    name="endDate"
                                    value={editedProject.endDate}
                                    onChange={handleInputChange}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                      <td>
                        <div>
                          <h3><u>Contributors</u></h3>
                          <table style={{ margin: 'auto' }}>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Remove</th>
                              </tr>
                            </thead>
                            <tbody>
                              {contributors.map((contributor, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{contributor?.name}</td>
                                    <td>
                                      <button onClick={() => handleRemoveContributor(contributor)} style={{ backgroundColor: '#BD7676', padding: '4px'}}>x</button>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                        
                        <div>
                          <h4>Add Contributors</h4>
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="Enter contributor email"
                        />
                        <button onClick={handleAddContributor}>Add</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <hr />
              <div>
                <button onClick={handleSave}>Save</button>
                <button onClick={handleClose}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setEditedProject({
      ...editedProject,
      contributors: contributors.map(contributor => contributor.email),
    });
  }, [contributors])

  // if (loading) {
  //   /**
  //    * @todo Ethan said: the return statement is too long and needs to be cleaned up
  //    */
  //   return <div>Loading...</div>;
  // }

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
      {Object.entries(reverseDictionary(projectListSortedByEndDate(projects)))
      .map(([id, project]) => {
        const backgroundColor = isExpired(project.endDate) ? '#BD7676' : '#1BA098';
        const contributorsOfEachProject = allProjectContributors && Object.keys(allProjectContributors).length > 0 
          ? (allProjectContributors[id]
              ? allProjectContributors[id].map((value) => value.name)
              : []
            )
          : []

        return (
          <div key={project.name} style={{ backgroundColor, padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to={`/project/${id}`} onClick={() => setChosenProjectId(id)} style={{ flex: 1, textDecoration: 'none', color: 'black', display: 'block' }}>
                <div style={{ paddingRight: '20px' }}>
                  <p style={{ textAlign: 'left', margin: 0, fontWeight: 'bold', fontSize: '24px' }}>{project.name}</p>
                  <div style={{ textAlign: 'left' }}>
                    <div>{project.description}</div>
                    <div style={{ margin: '10px 0' }}>Contributors: <i>{contributorsOfProject.join(", ")}</i></div>
                  </div>
                </div>
              </Link>
              <div style={{ marginLeft: '20px' }}>
                <div style={{ color: 'black', fontSize: '18px' }}>
                  <div><b>Start date:</b> {project.startDate}</div>
                  <div><b>End date:</b> {project.endDate}</div>
                </div>
                <div style={{ margin: '15px 0', textAlign: 'right' }}>
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