import React from 'react';

const KanbanView = () => {
  const currentDate = new Date();

  const tasks = {
    todo: [
      { name: 'Task 1', endDate: '2024-09-05', description: 'Description of Task 1' },
      { name: 'Task 2', endDate: '2024-08-30', description: 'Description of Task 2' }
    ],
    inProgress: [
      { name: 'Task 3', endDate: '2024-09-12', description: 'Description of Task 3' }
    ],
    done: [
      { name: 'Task 4', endDate: '2024-09-02', description: 'Description of Task 4' }
    ]
  };

  const renderTasks = (tasks) => {
    return tasks.map((task, index) => {
      const taskEndDate = new Date(task.endDate);
      const isPastDue = taskEndDate < currentDate;
      const taskBoxClass = isPastDue ? 'task-box past-due' : 'task-box';

      return (
        <div className={taskBoxClass} key={index}>
          <strong>{task.name}</strong>
          <em>Due date: {task.endDate}</em>
          <p>{task.description}</p>
        </div>
      );
    });
  };

  return (
    <div className="kanban-view">
      <div className="kanban-header">
      <h1 style={{ textAlign: 'left', padding: '40px 0 0 0' }}>Kanban View</h1>
        <div className="kanban-buttons">
          <button className="kanban-button">Filter</button>
          <button className="kanban-button">Sort by</button>
          <button className="kanban-button">Add task</button>
        </div>
      </div>
      <hr/><br/>
      <div className="kanban-columns">
        <div className="kanban-column">
          <h2>To Do</h2>
          {renderTasks(tasks.todo)}
        </div>
        <div className="kanban-column">
          <h2>In Progress</h2>
          {renderTasks(tasks.inProgress)}
        </div>
        <div className="kanban-column">
          <h2>Done</h2>
          {renderTasks(tasks.done)}
        </div>
      </div>
    </div>
  );
};

export default KanbanView;