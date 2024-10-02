import React, { useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TaskContext } from '../../../../contexts/TaskContext';
import moment from 'moment';
import '../../../../assets/styles/KanbanView.css';

const KanbanView = () => {
  const currentDate = new Date();

  const { projectId } = useParams();
  const { setChosenProjectId } = useContext(TaskContext);
  const { projectTasks } = useContext(TaskContext);
  const tasks = projectTasks && projectTasks[projectId] ? projectTasks[projectId] : [];

  /* Used for future implementation of task edit popup */
  const handleTaskClick = (task) => {
    console.log('Task clicked:', task);
  };

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
          <button className="kanban-button">Filter</button>
          <button className="kanban-button">Sort by</button>
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