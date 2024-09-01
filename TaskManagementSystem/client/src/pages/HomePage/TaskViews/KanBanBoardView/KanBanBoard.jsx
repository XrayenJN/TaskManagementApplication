import React from 'react';

const KanbanView = () => {
  const tasks = {
    todo: [
      { name: 'Task 1', endDate: '2024-09-05', description: 'Description of Task 1' },
      { name: 'Task 2', endDate: '2024-09-10', description: 'Description of Task 2' }
    ],
    inProgress: [
      { name: 'Task 3', endDate: '2024-09-12', description: 'Description of Task 3' }
    ],
    done: [
      { name: 'Task 4', endDate: '2024-09-02', description: 'Description of Task 4' }
    ]
  };

  const renderTasks = (tasks) => {
    return tasks.map((task, index) => (
      <div className="task-box" key={index}>
        <strong>{task.name}</strong>
        <em>{task.endDate}</em>
        <p>{task.description}</p>
      </div>
    ));
  };

  return (
    <div className="kanban-view">
      <br/>
      <h1>Kanban View</h1>
      <hr/>
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