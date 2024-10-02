import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TaskContext } from '../../../../contexts/TaskContext';
import moment from 'moment';
import '../../../../assets/styles/KanbanView.css';
import { getContributors } from '../../../../firebase/firebase';
import TaskEditPopup from '../../../../components/TaskEditPopup';

const KanbanView = () => {
  const currentDate = new Date();
  const { projectId } = useParams();
  const { projectTasks, setInViewPage } = useContext(TaskContext);
  const { setChosenProjectId } = useContext(TaskContext);
  const tasks = projectTasks && projectTasks[projectId] ? projectTasks[projectId] : [];
  const [contributors, setContributors] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const retrieveContributors = async () => {
      const theContributors = await getContributors(projectId);
      setContributors(theContributors);
    };

    retrieveContributors();
    setInViewPage(true);
    setChosenProjectId(projectId);
  }, [projectId]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedTask(null);
  };

  const formatDate = (date) => {
    if (!date) return "No date";
    if (date.seconds) {
      return moment(date.toDate()).format('MMMM Do, YYYY');
    }
    return moment(date).format('DD/MM/YYYY');
  };

  const renderTasks = (tasks) => {
    return tasks.map((task, index) => {
      let taskEndDate = ""
      if (task.endDate != null) {
        taskEndDate = task.endDate.seconds ? task.endDate.toDate() : task.endDate;
      }
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

      {isPopupOpen && selectedTask && (
        <TaskEditPopup
          task={selectedTask}
          contributors={contributors}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default KanbanView;