import React, { useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createNewProjectTaskDocument, getContributors } from '../firebase/firebase';
import { ProjectTask } from '../models/ProjectTask';
import { TaskContext } from '../contexts/TaskContext';

export default function NewProjectTaskForm() {
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
  const { refreshTasks } = useContext(TaskContext);

  //Find all the contributors of the projects
  const retrieveContributors = async () => {
    const theContributors = await getContributors(projectId);
    setContributors(theContributors);
  }  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProjectTask = new ProjectTask( name, description, startDate, endDate, comments, links, isMilestone, status, owners );

    await createNewProjectTaskDocument(newProjectTask, projectId);
    refreshTasks();  // Call refreshTasks function
    history.replace(`/project/${projectId}`);
  };

  retrieveContributors()
  return (
    <div aria-label="main">
      <h1>Create New Project Task</h1>
      <form aria-label="form" onSubmit={handleSubmit}>
        <div>
          <h2>Project Task Name</h2>
          <input
            aria-label="Project Task Name"
            type="text"
            placeholder='Project Task name'
            onChange={(e) => setName(e.target.value)}
            required
          />  
        </div>
        <div aria-label="Description" style={{paddingTop:'10px'}}>
          <textarea
            aria-label="Description"
            placeholder='Description'
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div style={{paddingTop:'10px'}}>
          <textarea
          aria-label="Comments"
            placeholder='Comments'
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <div style={{paddingTop:'10px'}}>
          <textarea
          aria-label="Links"
            placeholder='Links'
            onChange={(e) => setLinks(e.target.value)}
          />
        </div>
        <div style={{ paddingTop: '10px' }}>
          <label>
            <input
            aria-label="combobox"
              type="checkbox"
              onChange={(e) => setMilestone(e.target.checked)}
            />
            Milestone
          </label>
        </div>
        <div style={{ paddingTop: '10px' }}>
          <select
          aria-label="Status"
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
          aria-label="owners"
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
          aria-label="Start Date:"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <h2>End Date:</h2>
          <input
          aria-label="End Date:"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button type="submit">Create Project Task</button>
      </form>
    </div>
  );
};

