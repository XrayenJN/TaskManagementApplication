import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { TaskContext } from '../contexts/TaskContext';
import { getContributors, getUser, updateTask } from '../firebase/firebase';
import { DatePicker, Space } from 'antd';
import { addTimeToDate, extractDate } from '../utils/dateHandler';
import moment from 'moment';

const ListView = () => {
  const { RangePicker } = DatePicker;
  const { projectId } = useParams();
  const { projectTasks, refreshTasks, setInViewPage } = useContext(TaskContext)
  const { setChosenProjectId } = useContext(TaskContext);
  const [chosenTaskId, setChosenTaskId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [contributors, setContributors] = useState([]);
  const [editedTask, setEditedTask] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    comments: '',
    links: '',
    isMeeting: false,
    status: null,
    owners: [],
  });

  //https://stackoverflow.com/questions/1462719/javascript-change-the-function-of-the-browsers-back-button
  window.addEventListener("popstate", () => {
    setInViewPage(false)
  })

  const retrieveContributors = async () => {
    const theContributors = await getContributors(projectId);
    setContributors(theContributors);
  }  

  useEffect(() => {
    retrieveContributors();
    setInViewPage(true);
    setChosenProjectId(projectId);
  }, [])

  const togglePopup = async (task) => {
    const ownerDetails = await getUser(task.owners[0]);
    setChosenTaskId(task.id);
    setEditedTask({
      name: task.name,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      comments: task.comments,
      links: task.links,
      isMeeting: task.isMeeting,
      status: task.status,
      owners: ownerDetails.email
    });
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    console.log(editedTask)
  }, [editedTask])

  const handleInputChange = (e) => {
    const { type, name, checked, value } = e.target;
    console.log(type, name, checked, value)
    setEditedTask({ ...editedTask, 
      [name]: type === "checkbox" ? checked : value, 
      [name]: type === "date" ? addTimeToDate(value) : value });
  };

  const handleSave = async () => {
    await updateTask(chosenTaskId, editedTask)
    refreshTasks();
    setShowPopup(false);
  };

  const onChange = (_, dateStrings) => {
    const formattedStartDate = dateStrings[0] ? addTimeToDate(dateStrings[0], editedTask.isMeeting) : startTime 
    const formattedEndDate = dateStrings[1] ? addTimeToDate(dateStrings[1], editedTask.isMeeting) : endTime
    console.log(formattedEndDate, formattedStartDate)
    setEditedTask({
      ...editedTask,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    })
  };

  const [defaultRange, setDefaultRange] = useState([
    moment().subtract(7, 'days'), // Start date: 7 days ago
    moment() // End date: today
  ]);


  const meetingComponent = () => {
    if (!editedTask.isMeeting) {
      return (
        <div>
          <div style={{ paddingTop: '10px' }}>
            <select
            name="status"
            value={editedTask.status}
            onChange={handleInputChange}
            required>
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
              name="startDate"
              type="date"
              value={extractDate(editedTask.startDate)}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <h2>End Date:</h2>
            <input
              name="endDate"
              type="date"
              value={extractDate(editedTask.endDate)}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <h2>Meeting time</h2>
          <Space direction="vertical" size={12}>
            <RangePicker
              showTime={{
                format: 'HH:mm',
              }}
              value={defaultRange}
              // value={[editedTask.startDate, editedTask.endDate]}
              onChange={onChange}
              format="YYYY-MM-DD HH:mm"
            />
          </Space>
        </div>
      )
    }
  };

  const tasksOutput = () => {
    if (projectTasks && projectTasks[projectId]) {
      return (
        <ul>
          {projectTasks[projectId].map(task => (
            <li key={task.id}>
              Name: {task.name} - Desc: {task.description}
              <button onClick={() => togglePopup(task)} style={{ backgroundColor: '#DEB992', color: 'black', padding: '5px 10px', cursor: 'pointer', borderRadius: '0' }}>Edit Project Details</button>
              {showPopup && (
                <div className="popup">
                  <div className="popup-content" style={{ backgroundColor: '#DEB992' }}>
                    <h2>Edit Task Details</h2>
                    <hr />

                    <div>
                      <table style={{ margin: 'auto' }}>
                        <tbody>
                          <tr>
                            <td>
                              <div>
                                <h3><u>Task Name</u></h3>
                                <input
                                  type="text"
                                  name="name"
                                  value={editedTask.name}
                                  onChange={handleInputChange}
                                />
                              </div>

                              <div>
                                <h3><u>Task Description</u></h3>
                                <textarea
                                  name="description"
                                  style={{ color: 'black' }}
                                  value={editedTask.description}
                                  onChange={handleInputChange}
                                />
                              </div>

                              <div>
                                <h3><u>Task Comments</u></h3>
                                <textarea
                                  type="text"
                                  name="comments"
                                  value={editedTask.comments}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </td>
                            <td>
                              <div>
                                <h3><u>Task Links</u></h3>
                                <textarea
                                  name="links"
                                  style={{ color: 'black' }}
                                  value={editedTask.links}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div>
                              <label>
                                <input
                                  name="isMeeting"
                                  type="checkbox"
                                  checked={editedTask.isMeeting}
                                  onChange={handleInputChange}
                                />
                                  Meeting
                                </label>
                              </div>
                              <div>
                                <select
                                  name="owners"
                                  value={editedTask.owners}
                                  onChange={handleInputChange}
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
                                {meetingComponent()}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <hr />
                    <div>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div>
      <div>
        <h1>Project Task List</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to={`/project/${projectId}/new-project-task-form`} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
            Add Project Task
          </Link>
        </div>
        <div>
          {tasksOutput()}
        </div>
      </div>
    </div>
  );
}

export default ListView;