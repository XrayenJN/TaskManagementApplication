import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TaskContext } from '../../../../contexts/TaskContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getContributors } from '../../../../firebase/firebase';
import TaskEditPopup from '../../../../components/TaskEditPopup';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const { projectId } = useParams();
  const { projectTasks, setInViewPage } = useContext(TaskContext);
  const { setChosenProjectId } = useContext(TaskContext);
  const tasks = projectTasks && projectTasks[projectId] ? projectTasks[projectId] : [];
  const [contributors, setContributors] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const retrieveContributors = async () => {
      const theContributors = await getContributors(projectId);
      setContributors(theContributors);
    };

    retrieveContributors();
    setInViewPage(true);
    setChosenProjectId(projectId);
  }, [projectId]);

  useEffect(() => {
    setChosenProjectId(projectId)
  }, [projectId])

  const events = tasks.map(task => ({
    title: task.name,
    start: new Date(task.endDate),
    end: new Date(task.endDate),
    allDay: true,
    description: task.description,
    status: task.status,
    owners: task.owners,
    isMeeting: task.isMeeting,
  }));

  const eventStyleGetter = (event) => {
    const now = new Date();
    let backgroundColor = '#A5A58D';

    if (event.status === 'Completed') {
      backgroundColor = '#1BA098';
    }
    else if (new Date(event.end) < now && event.status !== 'Completed' && !event.isMeeting) {
      backgroundColor = '#BD7676';
    }
    // console.log(event.isMeeting)
    else if (event.isMeeting){
      backgroundColor = '#8da5a5';
    }

    return {
      style: {
        backgroundColor,
      }
    };
  };

  const handleEventClick = (event) => {
    const task = tasks.find(t => t.name === event.title);
    setSelectedTask(task);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setSelectedTask(null);
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '90vh'}}>
      <h1 style={{ textAlign: 'left', padding: '40px 0 0 0' }}>Calendar View</h1>
      <Link to={`/project/${projectId}/new-project-task-form`} className="kanban-button" style={{ display: 'flex', width: '70px', position: 'absolute', margin: '90px', right: '-60px' }}>
        Add task
      </Link>
      <hr style={{padding: '0 1500px 0 0', marginTop: '-20px'}}/><br/>
      <div style={{flexGrow: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '0'}}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          style={{ height: '100%', width: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleEventClick}
        />
      </div>
      {isPopupVisible && (
        <TaskEditPopup
          task={selectedTask}
          contributors={contributors}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default CalendarView;