import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TaskContext } from '../../../../contexts/TaskContext';
import { getContributors, updateTask } from '../../../../firebase/firebase';
import Select, { components } from 'react-select';
import { sortTaskByAToZ, sortTaskByZToA, sortTaskByDueDate, filterTaskByActiveStatus, filterTaskByExpiredStatus, filterTaskByOwner } from '../../../../utils/taskUtility';
import moment from 'moment';


const ListView = () => {
  const { projectId } = useParams();
  const { projectTasks, refreshTasks, setInViewPage } = useContext(TaskContext);
  const { setChosenProjectId } = useContext(TaskContext);
  const [chosenTaskId, setChosenTaskId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [contributors, setContributors] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
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

  useEffect(() => {
    if (projectTasks && projectTasks[projectId]) {

      // Group tasks by end date first
      const grouped = groupTasksByEndDate(projectTasks, projectId);
  
      // Update the state with the sorted grouped tasks
      setGroupedTasks(grouped);
    }
  }, [projectTasks, projectId]);

  const filterOptions = [
    { value: 'filterTaskByActiveStatus', label: 'Active Task' },
    { value: 'filterTaskByExpiredStatus', label: 'Expired Task' }
  ]

  const contributorOptions = contributors.map(contributor => 
    ({ value: contributor.name, label: contributor.name })
  )

  const filterOptionsWithOwner = filterOptions.concat(contributorOptions);

  const sortByOptions = [
    { value: 'sortTaskByAToZ', label: 'Sort Tasks BY (A to Z)' },
    { value: 'sortTaskByZToA', label: 'Sort Tasks BY (Z to A)' },
    { value: 'sortTaskByDueDate', label: 'Sort Tasks By Due Date' }
  ]

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
    await updateTask(chosenTaskId, editedTask);
    refreshTasks();
    setShowPopup(false);
  };

  const handleFilterButtonClick = () => {
    setIsFilterOpen(!isFilterOpen);
    if (isFilterOpen) {
      // If the filter panel is closing, reset groupedTasks to the original state
      if (projectTasks && projectTasks[projectId]) {
        // Call groupTasksByEndDate to re-group the tasks without any filters
        const grouped = groupTasksByEndDate(projectTasks, projectId);
        setGroupedTasks(grouped);
        setSelectedFilter([]);
      }
    }
  }

  const handleSortButtonClick = () => {
    setIsSortByOpen(!isSortByOpen);
    if (isSortByOpen) {
      // If the filter panel is closing, reset groupedTasks to the original state
      if (projectTasks && projectTasks[projectId]) {
        // Call groupTasksByEndDate to re-group the tasks without any filters
        const grouped = groupTasksByEndDate(projectTasks, projectId);
        setGroupedTasks(grouped);
        setSelectedSortBy(null);
      }
    }
  }

  const handleSortByChanges = (selectedOption) => {
    setSelectedSortBy(selectedOption ? selectedOption.value : null);
    handleSortBy(selectedSortBy);
  }

  const handleFilterChanges = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedFilter(values);
    handleFilter(values);
    console.log(values);
  }

  const handleSortBy = (sortByValue) => {
    if (sortByValue === 'sortTaskByAToZ') {
      setGroupedTasks(sortGroupedTasksByKeyAToZ(groupedTasks));
    } else if (sortByValue === 'sortTaskByZToA') {
      setGroupedTasks(sortGroupedTasksByKeyZToA(groupedTasks));
    } else if (sortByValue === 'sortTaskByDueDate') {
      setGroupedTasks(sortGroupedTasksByDueDate(groupedTasks));
    }
  }

  const handleFilter = (filterValues) => {
    let updatedTasks = groupedTasks;

    // Separate the filters into different categories for better processing
    const activeStatusFilter = filterValues.includes('filterTaskByActiveStatus');
    const expiredStatusFilter = filterValues.includes('filterTaskByExpiredStatus');
    const ownerNameFilters = filterValues.filter(value => value !== 'filterTaskByActiveStatus' && value !== 'filterTaskByExpiredStatus');

    // Apply active status filter if selected
    if (activeStatusFilter) {
      updatedTasks = filterGroupedTasksByActiveStatus(updatedTasks);
    }

    // Apply expired status filter if selected
    if (expiredStatusFilter) {
      updatedTasks = filterGroupedTasksByExpiredStatus(updatedTasks);
    }

    // Apply owner name filters if selected
    if (ownerNameFilters.length > 0) {
      updatedTasks = filterGroupedTasksByOwnerName(updatedTasks, ownerNameFilters);
    }

    // Update the groupedTasks state with the filtered tasks
    setGroupedTasks(updatedTasks);
  }

  const groupTasksByEndDate = (projectTasks, projectId) => {
    return projectTasks[projectId]?.reduce((acc, task) => {
      const dateKey = task.endDate;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(task);
      return acc;
    }, {});
  }

  const sortGroupedTasksByDueDate = (groupedTasks) => {
    // Convert the keys to an array and sort them as dates
    const sortedKeys = Object.keys(groupedTasks).sort((a, b) => new Date(a) - new Date(b));
  
    // Create a new object with the sorted keys
    const sortedGroupedTasks = sortedKeys.reduce((acc, key) => {
      acc[key] = groupedTasks[key];
      return acc;
    }, {});
  
    return sortedGroupedTasks;
  };

  const sortGroupedTasksByKeyZToA = (groupedTasks) => {
    // Sort the grouped tasks by end date key
    const sortedKeys = Object.keys(groupedTasks).sort((a, b) => new Date(a) - new Date(b));
  
    // Create a new object with sorted keys
    const sortedGroupedTasks = {};
    sortedKeys.forEach((key) => {
      // Sort tasks inside each group from A to Z by their name
      const sortedTasks = groupedTasks[key].sort((taskA, taskB) =>
        taskA.name.localeCompare(taskB.name)
      );
      sortedGroupedTasks[key] = sortedTasks;
    });
  
    return sortedGroupedTasks;
  };

  const sortGroupedTasksByKeyAToZ = (groupedTasks) => {
    const sortedKeys = Object.keys(groupedTasks).sort((a, b) => new Date(a) - new Date(b));
  
    const sortedGroupedTasks = {};
    sortedKeys.forEach((key) => {
      // Sort tasks alphabetically from Z to A
      const sortedTasks = groupedTasks[key].sort((taskA, taskB) =>
        taskB.name.localeCompare(taskA.name)
      );
      sortedGroupedTasks[key] = sortedTasks;
    });
  
    return sortedGroupedTasks;
  };

  const filterGroupedTasksByOwnerName = (groupedTasks, ownerName) => {
    // Create a new grouped object to store the filtered tasks
    const filteredGroupedTasks = {};
  
    // Iterate through each group (each end date)
    Object.entries(groupedTasks).forEach(([date, tasks]) => {
      // Filter tasks that have the specified owner's name
      const filteredTasks = tasks.filter(task =>
        task.owners.some(owner => ownerName.includes(owner.name))
      );
  
      // Only add the group if there are filtered tasks for that date
      if (filteredTasks.length > 0) {
        filteredGroupedTasks[date] = filteredTasks;
      }
    });
  
    return filteredGroupedTasks;
  };

  const filterGroupedTasksByActiveStatus = (groupedTasks) => {
    const currentDate = new Date();
  
    // Create a new grouped object to store the filtered tasks
    const filteredGroupedTasks = {};
  
    // Iterate through each group (each end date)
    Object.entries(groupedTasks).forEach(([date, tasks]) => {
      // Filter tasks whose end date is in the future
      const filteredTasks = tasks.filter(task => {
        const endDate = new Date(task.endDate);
        return endDate >= currentDate; // Task is active if the end date has not passed
      });
  
      // Only add the group if there are filtered tasks for that date
      if (filteredTasks.length > 0) {
        filteredGroupedTasks[date] = filteredTasks;
      }
    });
  
    return filteredGroupedTasks;
  };

  const filterGroupedTasksByExpiredStatus = (groupedTasks) => {
    const currentDate = new Date();
  
    // Create a new grouped object to store the filtered tasks
    const filteredGroupedTasks = {};
  
    // Iterate through each group (each end date)
    Object.entries(groupedTasks).forEach(([date, tasks]) => {
      // Filter tasks whose end date has already passed
      const filteredTasks = tasks.filter(task => {
        const endDate = new Date(task.endDate);
        return endDate < currentDate; // Task is expired if the end date has passed
      });
  
      // Only add the group if there are filtered tasks for that date
      if (filteredTasks.length > 0) {
        filteredGroupedTasks[date] = filteredTasks;
      }
    });
  
    return filteredGroupedTasks;
  };
  

  // console.log(projectTasks[projectId]);
  // console.log(groupedTasks);

  const tasksOutput = () => {
    if (projectTasks) {
      return (
        <ul style={{ listStyle: 'none' }} >
          {Object.entries(groupedTasks).map(([date, tasks]) => (
            <li key={date} style={{ marginBottom: '30px' }}>
              <div style={{ textAlign: 'left', marginBottom: '10px', color: 'black', fontSize: '20px', fontWeight: 'bold' }}>
                <i>{moment(date).format('ddd - DD, MMM, YYYY')}</i>
              </div>
              {tasks.map(task => (
                <div key={task.id} style={{ backgroundColor: '#3BAEA0', padding: '20px', cursor: 'pointer', marginTop: '15px' }} onClick={() => togglePopup(task)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ textAlign: 'left', margin: 0, fontWeight: 'bold', color: 'black', fontSize: '24px' }}>{task.name}</p>
                      <div style={{ textAlign: 'left', color: 'black' }}>
                        <div>{task.description}</div>
                        <div style={{ margin: '10px 0' }}>Contributors: <i>{task.owners.map(owner => owner.name).join(",")}</i></div>
                      </div>
                    </div>
                  </div>
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
            <button onClick={handleFilterButtonClick} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer', marginRight: '25px', borderRadius: '0' }}>Filter</button>
            {isFilterOpen && (
              <div style={{ position: 'absolute', top: '100%', left: '0', marginTop: '5px', zIndex: '1' }}>
                <Select
                  className='basic-multi-select'
                  classNamePrefix='select'
                  options={filterOptionsWithOwner}
                  placeholder='Select one or more'
                  styles={{ container: () => ({ width: '300px' }) }}
                  onChange={handleFilterChanges}
                  isClearable={false}
                  isMulti
                />
              </div>
            )}
          </div>
          <div style={{ position: 'relative', marginRight: '15px' }}>
            <button onClick={handleSortButtonClick} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer', borderRadius: '0' }}>Sort By</button>
            {isSortByOpen && (
              <div style={{ position: 'absolute', top: '100%', left: '0', marginTop: '5px', zIndex: '1' }}>
                <Select
                  className='basic-multi-select'
                  classNamePrefix="select"
                  options={sortByOptions}
                  placeholder='Please select one'
                  styles={{ container: () => ({ width: '300px' }) }}
                  onChange={handleSortByChanges}
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
