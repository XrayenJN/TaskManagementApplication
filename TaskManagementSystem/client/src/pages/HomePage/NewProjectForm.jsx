import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { createNewProjectDocument, checkUsersExists } from '../../firebase/firebase';
import { Project } from '../../models/Project';
import { ProjectContext } from '../../contexts/ProjectContext';

const NewProjectForm = () => {
  const { setRefreshTrigger } = useContext(ProjectContext);
  const [name, setName] = useState('New Project');
  const [description, setDescription] = useState('No Description Given');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [contributors, setContributors] = useState([]);
  const [userId, setUserId] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [email, setEmail] = useState('');

  const history = useHistory();

  useEffect(() => {
    // Disable scrolling
    document.body.style.margin = '0'; // Remove any default margin
    document.body.style.backgroundColor = '#F4F1E7';

    // Re-enable scrolling when the component is unmounted
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.margin = ''; // Restore the margin
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(startDate) > new Date(endDate)){
      alert("Start date should be before the End Date!");
      return;
    }

    const newProject = new Project( name, description, startDate, endDate, contributors );

    /**
     * @todo : Ethan said that "this return needs to be cleaned up its way too long"
     */
    await createNewProjectDocument(newProject);
    setRefreshTrigger(true)
    history.replace('/projects');
  };

  const handleCancelButton = () => {
    history.goBack();
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsEmailValid(false);
  };

  const handleAddContributor = async () => {
    const result = await checkUsersExists(email);
    // @todo: refactor it later, if we have time
    if (result.length > 0) {
      const user = result[0]
      setUserId(result[0].userId);
      alert('The email is valid');
      setContributors(value => [...value, user])
      setIsEmailValid(true);
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

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#DEB992', width: '50%', boxSizing: 'border-box'}}>
        <h1 style={{ marginTop: '50px' }}>Create New Project</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <h2>Project Name</h2>
            <input
              type="text"
              placeholder='Project name'
              onChange={(e) => setName(e.target.value)}
              
              required
            />  
          </div>
          <div style={{paddingTop: '10px'}}>
            <textarea
              placeholder='Description'
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div style={{paddingTop: '10px'}}>
            <h2>Start Date:</h2>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div style={{paddingTop: '10px'}}>
            <h2>End Date:</h2>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div style={{paddingTop: '10px'}}>

            <h2>Add Contributor</h2>
            <table style={{ margin: 'auto' }}>
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
            <input
              type="text"
              placeholder='Email Address'
              value={email}
              style={{ marginLeft: '10px', marginRight: '10px' }}
              onChange={handleEmailChange}
            />
            <button type="button" onClick={handleAddContributor} style={{ backgroundColor: '#F4F1E7', color: 'black', padding: '5px 10px', cursor: 'pointer', borderRadius: '15px'}}>Add Contributor</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button type="submit" style={{ backgroundColor: '#1BA098', color: 'black', padding: '5px 10px', cursor: 'pointer', borderRadius: '15px' }}>Create Project</button>
          <button type="button" onClick = {handleCancelButton} style={{ backgroundColor: '#A5A58D', color: 'black', padding: '5px 10px', cursor: 'pointer', borderRadius: '15px' }}>Cancel</button>
          </div>
        </form>
      </div> 
    </div>
  );
};

export default NewProjectForm;