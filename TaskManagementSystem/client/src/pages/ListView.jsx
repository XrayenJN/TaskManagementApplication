import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { TaskContext } from '../contexts/TaskContext';
import { getContributors, updateTask } from '../firebase/firebase';

const ListView = () => {
  const { projectId } = useParams();
  const { projectTasks, refreshTasks } = useContext(TaskContext)
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
    isMilestone: false,
    status: null,
    owners: [],
  });

  const retrieveContributors = async () => {
    const theContributors = await getContributors(projectId);
    setContributors(theContributors);
  }  

  useEffect(() => {
    retrieveContributors()
  }, [])

  const togglePopup = (task) => {
    setChosenTaskId(task.id);
    setEditedTask({
      name: task.name,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      comments: task.comments,
      links: task.links,
      isMilestone: task.isMilestone,
      status: task.status,
      owners: task.owners[0] ? task.owners[0].email : task.owners,
    });
    setShowPopup(!showPopup);
  };

  const handleInputChange = (e) => {
    const { type, name, checked, value } = e.target;
    setEditedTask({ ...editedTask, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async () => {
    await updateTask(chosenTaskId, editedTask)
    refreshTasks();
    setShowPopup(false);
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
                                  name="isMilestone"
                                  type="checkbox"
                                  checked={editedTask.isMilestone}
                                  onChange={handleInputChange}
                                />
                                  Milestone
                                </label>
                              </div>

                              <div>
                                <h3><u>Task Status</u></h3>
                                <select
                                  name="status"
                                  value={editedTask.status}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Select Status</option>
                                  <option value="Backlog">Backlog</option>
                                  <option value="Ready">Ready</option>
                                  <option value="InProgress">InProgress</option>
                                  <option value="Completed">Completed</option>
                                </select>
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
                                          value={editedTask.startDate}
                                          onChange={handleInputChange}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="date"
                                          name="endDate"
                                          value={editedTask.endDate}
                                          onChange={handleInputChange}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
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