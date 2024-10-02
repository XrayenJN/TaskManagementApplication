import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TaskContext } from '../../../../contexts/TaskContext';
import { getContributors, updateTask } from '../../../../firebase/firebase';
import Select, { components } from 'react-select';
import { sortTaskByAToZ, sortTaskByZToA, sortTaskByDueDate, filterTaskByActiveStatus, filterTaskByExpiredStatus, filterTaskByOwner } from '../../../../utils/taskUtility';
import moment from 'moment';
import TaskEditPopup from '../../../../components/TaskEditPopup';


const ListView = () => {
  const { projectId } = useParams();
  const { projectTasks, refreshTasks, setInViewPage } = useContext(TaskContext);
  const { setChosenProjectId } = useContext(TaskContext);
  const [contributors, setContributors] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});

  const [selectedTask, setSelectedTask] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  window.addEventListener("popstate", () => {
    setInViewPage(false);
  });

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedTask(null);
  };

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
    const sortByValue = selectedOption ? selectedOption.value : null;
    setSelectedSortBy(sortByValue);
    applyFilterAndSort(selectedFilter, sortByValue);
  }

  const handleFilterChanges = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedFilter(values);
    applyFilterAndSort(values, selectedSortBy);
  }

  const applyFilterAndSort = (filterValues, sortByValue) => {
    // Start with the original grouped tasks
    let updatedTasks = groupTasksByEndDate(projectTasks, projectId);
  
    // Apply filtering
    if (filterValues && filterValues.length > 0) {
      const activeStatusFilter = filterValues.includes('filterTaskByActiveStatus');
      const expiredStatusFilter = filterValues.includes('filterTaskByExpiredStatus');
      const ownerNameFilters = filterValues.filter(value => value !== 'filterTaskByActiveStatus' && value !== 'filterTaskByExpiredStatus');
  
      if (activeStatusFilter) {
        updatedTasks = filterGroupedTasksByActiveStatus(updatedTasks);
      }
  
      if (expiredStatusFilter) {
        updatedTasks = filterGroupedTasksByExpiredStatus(updatedTasks);
      }
  
      if (ownerNameFilters.length > 0) {
        updatedTasks = filterGroupedTasksByOwnerName(updatedTasks, ownerNameFilters);
      }
    }
  
    // Apply sorting
    if (sortByValue) {
      if (sortByValue === 'sortTaskByAToZ') {
        updatedTasks = sortGroupedTasksByKeyAToZ(updatedTasks);
      } else if (sortByValue === 'sortTaskByZToA') {
        updatedTasks = sortGroupedTasksByKeyZToA(updatedTasks);
      } else if (sortByValue === 'sortTaskByDueDate') {
        updatedTasks = sortGroupedTasksByDueDate(updatedTasks);
      }
    }
  
    // Update the groupedTasks state with the filtered and sorted tasks
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

  const sortGroupedTasksByKeyAToZ = (groupedTasks) => {
  // Create a new object to store the sorted tasks
  const sortedGroupedTasks = {};

  // Iterate through each group and sort the tasks within each group
  Object.entries(groupedTasks).forEach(([key, tasks]) => {
    // Sort tasks from A to Z by their name
    sortedGroupedTasks[key] = tasks.sort((taskA, taskB) =>
      taskA.name.localeCompare(taskB.name)
    );
  });

  return sortedGroupedTasks;
  };

  const sortGroupedTasksByKeyZToA = (groupedTasks) => {
      // Create a new object to store the sorted tasks
  const sortedGroupedTasks = {};

  // Iterate through each group and sort the tasks within each group
  Object.entries(groupedTasks).forEach(([key, tasks]) => {
    // Sort tasks from Z to A by their name
    sortedGroupedTasks[key] = tasks.sort((taskA, taskB) =>
      taskB.name.localeCompare(taskA.name)
    );
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

  const tasksOutput = () => {
    if (projectTasks) {
      return (
        <ul style={{ listStyle: 'none' }}>
          {Object.entries(groupedTasks).map(([date, tasks]) => (
            <li key={date} style={{ marginBottom: '30px' }}>
              <div style={{ textAlign: 'left', marginBottom: '10px', color: 'black', fontSize: '20px', fontWeight: 'bold' }}>
                <i>{moment(date).format('ddd - DD, MMM, YYYY')}</i>
              </div>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  style={{ backgroundColor: '#3BAEA0', padding: '20px', cursor: 'pointer', marginTop: '15px' }}
                  onClick={() => handleTaskClick(task)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ textAlign: 'left', margin: 0, fontWeight: 'bold', color: 'black', fontSize: '24px' }}>{task.name}</p>
                      <div style={{ textAlign: 'left', color: 'black' }}>
                        <div>{task.description}</div>
                        <div style={{ margin: '10px 0' }}>
                          Contributors: <i>{task.owners.map((owner) => owner.name).join(', ')}</i>
                        </div>
                      </div>
                    </div>
                  </div>
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
              <div style={{ position: 'absolute', top: '100%', left: '-215%', marginTop: '5px', zIndex: '1' }}>
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
                  classNamePrefix='select'
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
        <hr style={{ marginTop: '30px', marginBottom: '30px', border: '1px solid #DEB992' }} />
        {tasksOutput()}
      </div>
      {isPopupOpen && (
        <TaskEditPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          task={selectedTask}
          contributors={contributors}
          updateTask={updateTask}
        />
      )}
    </div>
  );
};

export default ListView;
