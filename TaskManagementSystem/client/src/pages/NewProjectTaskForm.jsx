import React, { useState, useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createNewProjectTaskDocument, getContributors } from '../firebase/firebase';
import { ProjectTask } from '../models/ProjectTask';
import { TaskContext } from '../contexts/TaskContext';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);


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
  const [isMeeting, setMeeting] = useState(false);
  const [status, setStatus] = useState(null);
  const [owners, setOwners] = useState([]);
  const [meetingStartTime, setMeetingStartTime] = useState(null);
  const [meetingEndTime, setMeetingEndTime] = useState(null);
  const [contributors, setContributors] = useState([]);
  const history = useHistory();
  const { projectId } = useParams();
  const { refreshTasks } = useContext(TaskContext);

  const goBack = () => {
    history.goBack();
  };

  //Find all the contributors of the projects
  const retrieveContributors = async () => {
    const theContributors = await getContributors(projectId);
    setContributors(theContributors);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProjectTask = new ProjectTask(name, description, startDate, endDate, comments, links, isMeeting, status, owners, meetingTime);

    await createNewProjectTaskDocument(newProjectTask, projectId);
    refreshTasks();  // Call refreshTasks function
    history.replace(`/project/${projectId}`);
  };

  const meetingComponent = () => {
    if (!isMeeting) {
      return (
        <div>
          <div style={{ paddingTop: '10px' }}>
            <select onChange={(e) => setStatus(e.target.value)} required>
              <option value="">Select Status</option>
              <option value="Backlog">Backlog</option>
              <option value="Ready">Ready</option>
              <option value="InProgress">InProgress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <h2>Start Date:</h2>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <h2>End Date:</h2>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )
    }
    else {
      return (
        <div>

          <div>
            <h2>Start Date:</h2>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <div style={{ paddingTop: '5px' }}>
              <TimePicker onChange={(time, timeString) => setMeetingStartTime(time)} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
            </div>
          </div>
          <div>
            <h2>End Date:</h2>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <div style={{ paddingTop: '5px' }}>
              <TimePicker onChange={(time, timeString) => setMeetingEndTime(time)} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
            </div>
          </div>
        </div>
      )
    }
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
        <div style={{ paddingTop: '10px' }}>
          <textarea
            placeholder='Description'
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div style={{ paddingTop: '10px' }}>
          <textarea
            placeholder='Comments'
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <div style={{ paddingTop: '10px' }}>
          <textarea
            placeholder='Links'
            onChange={(e) => setLinks(e.target.value)}
          />
        </div>
        <div style={{ paddingTop: '10px' }}>
          <label>
            <input
              type="checkbox"
              onChange={(e) => setMeeting(e.target.checked)}
            />
            Meeting
          </label>
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
        {meetingComponent()}


        <div style={{ paddingTop: "10px" }}>
          <button type="submit">Create Project Task</button>
        </div>
      </form>
      <div style={{ paddingTop: "10px" }}>
        <button onClick={goBack}>Back</button>
      </div>
    </div>
  );
};

export default NewProjectTaskForm;
