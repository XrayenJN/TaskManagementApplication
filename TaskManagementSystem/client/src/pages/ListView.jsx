import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TaskContext } from '../contexts/TaskContext';
import { getContributors, getUser, updateTask } from '../firebase/firebase';
import Select from 'react-select';
import { DatePicker, Space } from 'antd';
import { addTimeToDate, extractDate } from '../utils/dateHandler';
import moment from 'moment';

const ListView = () => {
  const { RangePicker } = DatePicker;
  const { projectId } = useParams();
  const { projectTasks, refreshTasks, setInViewPage } = useContext(TaskContext);
  const { setChosenProjectId } = useContext(TaskContext);
  const [chosenTaskId, setChosenTaskId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [contributors, setContributors] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
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

  const filterOptions = [
    { value: 'filterOption 1', label: 'Active Task' },
    { value: 'filterOption 2', label: 'Expired Task' },
    { value: 'filterOption 3', label: 'Owner 1' },
    { value: 'filterOption 4', label: 'Owner 2' }
  ]

  const sortByOptions = [
    { value: 'sortByOption 1', label: 'Sort Tasks BY (A to Z)' },
    { value: 'sortByOption 2', label: 'Sort Tasks BY (Z to A)' },
    { value: 'sortByOption 3', label: 'Sort Tasks By Due Date' }
  ]

  window.addEventListener("popstate", () => {
    setInViewPage(false);
  });

  const retrieveContributors = async () => {
    const theContributors = await getContributors(projectId);
    setContributors(theContributors);
  };  

  useEffect(() => {
    retrieveContributors();
    setInViewPage(true);
    setChosenProjectId(projectId);
  }, []);

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

  const handleInputChange = (e) => {
    const { type, name, checked, value } = e.target;
    setEditedTask({ ...editedTask, 
      [name]: type === "checkbox" ? checked : type === "date" ? addTimeToDate(value) : value,
    })
  };

  const handleSave = async () => {
    await updateTask(chosenTaskId, editedTask);
    refreshTasks();
    setShowPopup(false);
  };

  const handleFilterButtonClick = () => {
    setIsFilterOpen(!isFilterOpen);
  }

  const handleSortButtonClick = () => {
    setIsSortByOpen(!isSortByOpen);
  }

  const groupedTasks = projectTasks[projectId]?.reduce((acc, task) => {
    const dateKey = task.endDate;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);
    return acc;
  }, {});

  const onChange = (_, dateStrings) => {
    const formattedStartDate = dateStrings[0] ? addTimeToDate(dateStrings[0], editedTask.isMeeting) : startTime 
    const formattedEndDate = dateStrings[1] ? addTimeToDate(dateStrings[1], editedTask.isMeeting) : endTime
    setEditedTask({
      ...editedTask,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    })
  };

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
              value={[moment(editedTask.startDate, "YYYY-MM-DD HH:mm"), moment(editedTask.endDate, "YYYY-MM-DD HH:mm")]}
              onChange={onChange}
              format="YYYY-MM-DD HH:mm"
            />
          </Space>
        </div>
      )
    }
  };

  const tasksOutput = () => {
    if (groupedTasks) {
      const sortedTaskByDates = Object.keys(groupedTasks).sort((a, b) => new Date(a) - new Date(b));
      return (
        <ul>
          {sortedTaskByDates.map(date => (
            <li key={date} style={{ marginBottom: '30px' }}>
              <div style={{ textAlign: 'left', marginBottom: '10px', color: 'black', fontSize: '20px', fontWeight: 'bold' }}>
                <i>{date}</i>
              </div>
              {groupedTasks[date].map(task => (
                <div key={task.id} style={{ backgroundColor: '#3BAEA0', padding: '20px', cursor: 'pointer', marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ textAlign: 'left', margin: 0, fontWeight: 'bold', color: 'black', fontSize: '24px' }}>{task.name}</p>
                      <div style={{ textAlign: 'left', color: 'black' }}>
                        <div>{task.description}</div>
                        <div style={{ margin: '10px 0' }}>Contributors: <i>{task.owners.join(", ")}</i></div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => togglePopup(task)} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
                    Edit Project Details
                  </button>
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
              </div>
              ))}
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div>
      <div>
        <h1 style={{ textAlign: 'left', marginTop: '50px' }}>List View</h1>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', marginRight: '5px' }}>
            <button onClick={handleFilterButtonClick} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer', marginRight: '25px' }}>Filter</button>
            {isFilterOpen && (
              <div style={{ position: 'absolute', top: '100%', left: '0', marginTop: '5px', zIndex: '1' }}>
                <Select
                  className='basic-multi-select'
                  classNamePrefix='select'
                  options={filterOptions}
                  placeholder='Select one or more'
                  styles={{ container: () => ({ width: '300px' }) }}
                  isMulti
                />
              </div>
            )}
          </div>
          <div style={{ position: 'relative', marginRight: '15px' }}>
            <button onClick={handleSortButtonClick} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Sort By</button>
            {isSortByOpen && (
              <div style={{ position: 'absolute', top: '100%', left: '0', marginTop: '5px', zIndex: '1' }}>
                <Select
                  className='basic-multi-select'
                  classNamePrefix="select"
                  options={sortByOptions}
                  placeholder='Please select one'
                  styles={{ container: () => ({ width: '300px' }) }}
                />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to={`/project/${projectId}/new-project-task-form`} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
              Add Project Task
            </Link>
          </div>
        </div>
        <hr style={{ margin: '20px 0', border: '1px solid #ccc'}}/>
        <div>
          {tasksOutput()}
        </div>
      </div>
    </div>
  );
}

export default ListView;
