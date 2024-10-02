import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createNewProjectDocument, checkUsersExists } from '../../firebase/firebase';
import { Project } from '../../models/Project';

const NewProjectForm = () => {
  const { setRefreshTrigger } = useContext(ProjectContext);
  const [name, setName] = useState('New Project');
  const [description, setDescription] = useState('No Description Given');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [contributors, setContributor] = useState([]);
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
    const newProject = new Project( name, description, startDate, endDate, [] );

    /**
     * @todo : Ethan said that "this return needs to be cleaned up its way too long"
     */
    await createNewProjectDocument(newProject);
    setRefreshTrigger(true)
    history.replace('/projects');
  };

  return (
    <div>
      <h1>Create New Project</h1>
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
        <div style={{paddingTop:'10px'}}>
          <textarea
            placeholder='Description'
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <h2>Start Date:</h2>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <h2>End Date:</h2>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default NewProjectForm;
