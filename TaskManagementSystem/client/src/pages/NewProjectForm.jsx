import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createNewProjectDocument } from '../firebase/firebase';

const NewProjectForm = () => {
  const [name, setName] = useState('Test');
  const [description, setDescription] = useState('This is a test project');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProject = { name, description, startDate, endDate };
    await createNewProjectDocument(newProject);
    history.replace('/projects');
  };

  return (
    <div>
      <h1>Create New Project</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
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
