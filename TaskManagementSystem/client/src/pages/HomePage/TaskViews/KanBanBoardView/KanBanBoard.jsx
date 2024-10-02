import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TaskContext } from '../../../../contexts/TaskContext';
import moment from 'moment';
import '../../../../assets/styles/KanbanView.css';
import Select from 'react-select';
import { sortTaskByAToZ, sortTaskByZToA, sortTaskByDueDate, filterTaskByActiveStatus, filterTaskByExpiredStatus, filterTaskByOwner } from '../../../../utils/taskUtility';


const KanbanView = () => {
  const currentDate = new Date();

  const { projectId } = useParams();
  const { setChosenProjectId } = useContext(TaskContext);
  const { projectTasks } = useContext(TaskContext);
  const tasks = projectTasks && projectTasks[projectId] ? projectTasks[projectId] : [];
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [outputTasks, setOutputTasks] = useState({});

  const filterOptions = [
    { value: 'filterTaskByActiveStatus', label: 'Active Task' },
    { value: 'filterTaskByExpiredStatus', label: 'Expired Task' }
  ]

  const sortByOptions = [
    { value: 'sortTaskByAToZ', label: 'Sort Tasks BY (A to Z)' },
    { value: 'sortTaskByZToA', label: 'Sort Tasks BY (Z to A)' },
    { value: 'sortTaskByDueDate', label: 'Sort Tasks By Due Date' }
  ]

  /* Used for future implementation of task edit popup */
  const handleTaskClick = (task) => {
    console.log('Task clicked:', task);
  };

  const handleFilterButtonClick = () => {
    setIsFilterOpen(!isFilterOpen);
    if (isFilterOpen) {
      // If the filter panel is closing, reset groupedTasks to the original state
      if (projectTasks && projectTasks[projectId]) {
        // Call groupTasksByEndDate to re-group the tasks without any filters
        setOutputTasks(groupedTasks);
        setSelectedFilter([]);
      }
    }
  }

  const handleSortByButtonClick = () => {
    setIsSortByOpen(!isSortByOpen);
    if (isSortByOpen) {
      // If the filter panel is closing, reset groupedTasks to the original state
      if (projectTasks && projectTasks[projectId]) {
        // Call groupTasksByEndDate to re-group the tasks without any filters
        setOutputTasks(groupedTasks);
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
    let updatedGroupedTasks = { ...groupedTasks };
    
    Object.keys(updatedGroupedTasks).forEach((groupKey) => {
      let updatedTasks = updatedGroupedTasks[groupKey];
      // Apply filtering if any filter values exist
      if (filterValues && filterValues.length > 0) {
        const activeStatusFilter = filterValues.includes('filterTaskByActiveStatus');
        const expiredStatusFilter = filterValues.includes('filterTaskByExpiredStatus');
        const ownerNameFilters = filterValues.filter(value => value !== 'filterTaskByActiveStatus' && value !== 'filterTaskByExpiredStatus');
  
        if (activeStatusFilter) {
          updatedTasks = filterTaskByActiveStatus(updatedTasks);
        }
  
        if (expiredStatusFilter) {
          updatedTasks = filterTaskByExpiredStatus(updatedTasks);
        }
  
        if (ownerNameFilters.length > 0) {
          ownerNameFilters.forEach(owner => {
            updatedTasks = filterTaskByOwner(updatedTasks, owner);
          });
        }
      }
  
      // Apply sorting
      if (sortByValue) {
        if (sortByValue === 'sortTaskByAToZ') {
          updatedTasks = sortTaskByAToZ(updatedTasks);
        } else if (sortByValue === 'sortTaskByZToA') {
          updatedTasks = sortTaskByZToA(updatedTasks);
        } else if (sortByValue === 'sortTaskByDueDate') {
          updatedTasks = sortTaskByDueDate(updatedTasks);
        }
      }
  
      // Update the group with the filtered and sorted tasks
      updatedGroupedTasks[groupKey] = updatedTasks;
    });

    setOutputTasks(updatedGroupedTasks);
    console.log(updatedGroupedTasks);
  }

  const formatDate = (date) => {
    if (!date) return "None";
    if (date.seconds) {
      return moment(date.toDate()).format('MMMM Do, YYYY');
    }
    return moment(date).format('DD/MM/YYYY');
  };

  useEffect(() => {
    setChosenProjectId(projectId)
  }, [projectId])

  const renderTasks = (tasks) => {
    return tasks.map((task, index) => {
      const taskEndDate = task.endDate?.seconds ? task.endDate.toDate() : task.endDate;
      const isPastDue = new Date(taskEndDate) < currentDate;
      const taskBoxClass = isPastDue ? 'task-box past-due' : 'task-box';

      return (
        <button
          key={index}
          className={taskBoxClass}
          onClick={() => handleTaskClick(task)}
        >
          <strong>{task.name}</strong>
          <em>Due date: {formatDate(taskEndDate)}</em>
          <p>{task.description}</p>
        </button>
      );
    });
  };

  const groupedTasks = {
    Backlog: tasks.filter(task => task.status === "Backlog"),
    ToDo: tasks.filter(task => task.status === "Ready"),
    InProgress: tasks.filter(task => task.status === "InProgress"),
    Done: tasks.filter(task => task.status === "Completed")
  };

  return (
    <div className="kanban-view">
      <div className="kanban-header">
      <h1 style={{ textAlign: 'left', padding: '40px 0 0 0' }}>Kanban View</h1>
        <div className="kanban-buttons">
          <button className="kanban-button" onClick={() => handleFilterButtonClick()}>Filter</button>
          {isFilterOpen && (
            <div>
              <Select
                className='basic-multi-select'
                classNamePrefix="select"
                options={filterOptions}
                placeholder="Filter Tasks"
                onChange={handleFilterChanges}
                isClearable={false}
                isMulti
              />
            </div>
          )}
          <button className="kanban-button" onClick={() => handleSortByButtonClick()}>Sort by</button>
          {isSortByOpen && (
            <div>
              <Select
                className='basic-multi-select'
                classNamePrefix="select"
                options={sortByOptions}
                placeholder="Sort By Tasks"
                onChange={handleSortByChanges}
              />
            </div>
          )}
          <Link to={`/project/${projectId}/new-project-task-form`} className="kanban-button">
            Add task
          </Link>
        </div>
      </div>
      <hr/><br/>
      <div className="kanban-columns">
        <div className="kanban-column">
          <h2>Backlog</h2>
          {renderTasks(groupedTasks.Backlog)}
        </div>
        <div className="kanban-column">
          <h2>To Do</h2>
          {renderTasks(groupedTasks.ToDo)}
        </div>
        <div className="kanban-column">
          <h2>In Progress</h2>
          {renderTasks(groupedTasks.InProgress)}
        </div>
        <div className="kanban-column">
          <h2>Done</h2>
          {renderTasks(groupedTasks.Done)}
        </div>
      </div>
    </div>
  );
};

export default KanbanView;