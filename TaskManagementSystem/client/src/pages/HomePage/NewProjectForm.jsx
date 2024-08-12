import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createNewProjectDocument } from '../../firebase/firebase';
import { Project } from '../../models/Project';

const NewProjectForm = () => {
  /**
   * @todo : make sure that the name, description, start date and end date is filled
   * @todo : make sure the start date is before the end date or vice versa
   * @todo : maybe there will be an option to have a placeholder
   */
  const [name, setName] = useState('New Project');
  const [description, setDescription] = useState('No Description Given');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProject = new Project( name, description, startDate, endDate, [] );

    /**
     * @todo : Ethan said that "this return needs to be cleaned up its way too long"
     */
    await createNewProjectDocument(newProject);
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
