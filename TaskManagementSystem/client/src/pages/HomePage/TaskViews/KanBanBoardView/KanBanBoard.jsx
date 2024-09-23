import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TaskContext } from '../../../../contexts/TaskContext';
import '../../../../assets/styles/KanbanView.css';

const KanbanView = () => {
  const currentDate = new Date();

  const { projectId } = useParams();
  const { projectTasks } = useContext(TaskContext);
  const tasks = projectTasks && projectTasks[projectId] ? projectTasks[projectId] : [];

  const handleTaskClick = (task) => {
    console.log('Task clicked:', task);
  };

  const renderTasks = (tasks) => {
    return tasks.map((task, index) => {
      const taskEndDate = new Date(task.endDate);
      const isPastDue = taskEndDate < currentDate;
      const taskBoxClass = isPastDue ? 'task-box past-due' : 'task-box';

      return (
        <button
          key={index}
          className={taskBoxClass}
          onClick={() => handleTaskClick(task)}
        >
          <strong>{task.name}</strong>
          <em>Due date: {task.endDate}</em>
          <p>{task.description}</p>
        </button>
      );
    });
  };

  const groupedTasks = {
    Backlog: tasks.filter(task => task.status === "Backlog"),
    ToDo: tasks.filter(task => task.status === "Ready"),
    InProgress: tasks.filter(task => task.status === "InProgress"),
    Done: tasks.filter(task => task.status === "Done")
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