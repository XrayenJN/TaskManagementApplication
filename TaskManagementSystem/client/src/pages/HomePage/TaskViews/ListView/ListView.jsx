import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TaskContext } from '../../../../contexts/TaskContext';
import { getContributors, updateTask } from '../../../../firebase/firebase';
import Select from 'react-select';
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
      const grouped = groupTasksByEndDate(projectTasks, projectId);
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
  }

  const handleSortButtonClick = () => {
    setIsSortByOpen(!isSortByOpen);
  }

  const handleSortByChanges = (selectedOption) => {
    setSelectedSortBy(selectedOption ? selectedOption.value : null);
    handleFilterAndSortBy(selectedSortBy, selectedFilter);
  }

  const handleFilterChanges = (selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setSelectedFilter(values);
  }

  const handleFilterAndSortBy = (sortByValue, filterValue) => {
    if (sortByValue === 'sortTaskByAToZ') {
      setGroupedTasks(sortTaskByAToZ(groupedTasks));
    } else if (sortByValue === 'sortTaskByZToA') {
      setGroupedTasks(sortTaskByZToA(groupedTasks));
    } else if (sortByValue === 'sortTaskByDueDate') {
      setGroupedTasks(sortTaskByDueDate(groupedTasks));
    }
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
            <button onClick={handleFilterButtonClick} style={{ backgroundColor: '#DEB992', color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer', marginRight: '25px' }}>Filter</button>
            {isFilterOpen && (
              <div style={{ position: 'absolute', top: '100%', left: '0', marginTop: '5px', zIndex: '1' }}>
                <Select
                  className='basic-multi-select'
                  classNamePrefix='select'
                  options={filterOptionsWithOwner}
                  placeholder='Select one or more'
                  styles={{ container: () => ({ width: '300px' }) }}
                  onChange={handleFilterChanges}
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
