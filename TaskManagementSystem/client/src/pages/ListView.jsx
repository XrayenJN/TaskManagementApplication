import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { TaskContext } from '../contexts/TaskContext';

const ListView = () => {
  const { projectId } = useParams();
  const { projectTasks } = useContext(TaskContext)
  const [showPopup, setShowPopup] = useState(false);
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

  const togglePopup = (task) => {
    setShowPopup(!showPopup);
    setEditedTask({
      name: task.name,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      comments: task.comments,
      links: task.links,
      isMilestone: task.isMilestone,
      status: task.status,
      owners: task.owners,
    });
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
                                  value={editedTask.name}
                                  onChange={handleInputChange}
                                />
                              </div>

                              <div>
                                <h3><u>Project Description</u></h3>
                                <textarea
                                  name="description"
                                  style={{ color: 'black' }}
                                  value={editedTask.description}
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
                                    {contributors[project.id]?.map((contributor, index) => (
                                      <tr key={index}>
                                        <td>{contributor.name}</td>
                                        <td>
                                          <button style={{ backgroundColor: '#BD7676', padding: '4px' }}>x</button>
                                        </td>
                                      </tr>
                                    ))}
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