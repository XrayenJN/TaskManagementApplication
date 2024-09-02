import React from 'react';

const KanbanView = () => {
  const currentDate = new Date();

  const tasks = [
    {
      name: "Task 1",
      description: "By Jordan",
      comments: "HEHEHEHA",
      endDate: "2024-08-23",
      isMilestone: true,
      links: "PLS",
      owners: [{ name: "Owner 1" }],
      startDate: "2024-08-30",
      status: "Backlog"
    },
    {
      name: "Task 5",
      description: "By Jordan again",
      comments: "HEHEHEHA",
      endDate: "2024-11-23",
      isMilestone: true,
      links: "PLS",
      owners: [{ name: "Owner 1" }],
      startDate: "2024-10-31",
      status: "Backlog"
    },
    {
      name: "Task 2",
      description: "Hello, task description here, by John. It is a longer description, thanks.",
      comments: "LOL",
      endDate: "2024-09-10",
      isMilestone: false,
      links: "PLS",
      owners: [{ name: "Owner 2" }],
      startDate: "2024-08-15",
      status: "To Do"
    },
    {
      name: "Task 3",
      description: "This is a description. Ring ring ring ring by Ethan",
      comments: "Hmm",
      endDate: "2024-09-08",
      isMilestone: false,
      links: "PLS",
      owners: [{ name: "Owner 3" }],
      startDate: "2024-08-18",
      status: "In Progress"
    },
    {
      name: "Task 4",
      description: "Hello hello by Edward",
      comments: "Hmm",
      endDate: "2024-09-05",
      isMilestone: false,
      links: "PLS",
      owners: [{ name: "Owner 4" }],
      startDate: "2024-08-18",
      status: "Done"
    }
  ];

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

  const groupedTasks = {
    Backlog: tasks.filter(task => task.status === "Backlog"),
    ToDo: tasks.filter(task => task.status === "To Do"),
    InProgress: tasks.filter(task => task.status === "In Progress"),
    Done: tasks.filter(task => task.status === "Done")
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