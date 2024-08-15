import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createNewProjectTaskDocument, getContributors } from '../firebase/firebase';
import { ProjectTask } from '../models/ProjectTask';

const NewProjectTaskForm = () => {
  /**
   * @todo : make sure that the name, description, start date and end date is filled
   * @todo : make sure the start date is before the end date or vice versa
   * @todo : maybe there will be an option to have a placeholder
   */
  const [name, setName] = useState('New Project Task');
  const [description, setDescription] = useState('No Description Given');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [comments, setComments] = useState("Additional information / comments");
  const [links, setLinks] = useState("Links provided here");
  const [isMilestone, setMilestone] = useState(false);
  const [status, setStatus] = useState(null);
  const [owners, setOwners] = useState([]);
  const [contributors, setContributors] = useState([]);
  const history = useHistory();
  const { projectId } = useParams();

  //Find all the contributors of the projects
  const retrieveContributors = async () => {
    const theContributors = await getContributors(projectId);
    setContributors(theContributors);
  }  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProjectTask = new ProjectTask( name, description, startDate, endDate, comments, links, isMilestone, status, owners );

    await createNewProjectTaskDocument(newProjectTask, projectId);
    history.replace('/projects');
  };

  retrieveContributors()
  return (
    <div>
      <h1>Create New Project Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Project Task Name</h2>
          <input
            type="text"
            placeholder='Project Task name'
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
        <div style={{paddingTop:'10px'}}>
          <textarea
            placeholder='Comments'
            onChange={(e) => setComments(e.target.value)}
            required
          />
        </div>
        <div style={{paddingTop:'10px'}}>
          <textarea
            placeholder='Links'
            onChange={(e) => setLinks(e.target.value)}
            required
          />
        </div>
        <div style={{ paddingTop: '10px' }}>
          <label>
            <input
              type="checkbox"
              onChange={(e) => setMilestone(e.target.checked)}
            />
            Milestone
          </label>
        </div>
        <div style={{ paddingTop: '10px' }}>
          <select
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="Backlog">Backlog</option>
            <option value="Ready">Ready</option>
            <option value="InProgress">InProgress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div style={{ paddingTop: '10px' }}>
          <select
            onChange={(e) => setOwners(e.target.value)}
            required
          >
            <option value="">Select Owner</option>
            {contributors.map((contributor, index) => (
              <option key={index} value={contributor.email}>
                {contributor.name}
              </option>
            ))}
          </select>
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
        <button type="submit">Create Project Task</button>
      </form>
    </div>
  );
};

export default NewProjectTaskForm;
