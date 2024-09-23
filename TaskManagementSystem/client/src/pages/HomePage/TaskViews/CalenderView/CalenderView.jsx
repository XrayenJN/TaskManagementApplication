import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TaskContext } from '../../../../contexts/TaskContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const { projectId } = useParams();
  const { projectTasks } = useContext(TaskContext);
  const tasks = projectTasks && projectTasks[projectId] ? projectTasks[projectId] : [];

  const events = tasks.map(task => ({
    title: task.name,
    start: new Date(task.endDate),
    end: new Date(task.endDate),
    allDay: true,
    description: task.description,
    status: task.status,
    owners: task.owners,
    isMilestone: task.isMilestone,
  }));

  const eventStyleGetter = (event) => {
    const now = new Date();
    let backgroundColor = '#A5A58D';

    if (event.status === 'Done') {
      backgroundColor = '#1BA098';
    }
    else if (new Date(event.end) < now && event.status !== 'Done') {
      backgroundColor = '#BD7676';
    }

    return {
      style: {
        backgroundColor,
      }
    };
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '90vh'}}>
      <h1 style={{ textAlign: 'left', padding: '40px 0 0 0' }}>Calendar View</h1>
      <Link to={`/project/${projectId}/new-project-task-form`} className="kanban-button" style={{ display: 'flex', width: '70px', position: 'absolute', margin: '90px', right: '-60px' }}>
        Add task
      </Link>
      <hr style={{padding: '0 1500px 0 0', marginTop: '-20px'}}/><br/>
      <div style={{flexGrow: '1', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          style={{ height: '100%', width: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => alert(`Task: ${event.title}\nDescription: ${event.description}\nStatus: ${event.status}\nOwners: ${event.owners.join(', ')}`)}
        />
      </div>
    </div>
  );
};

export default CalendarView;