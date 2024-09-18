import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const dummyTasks = [
    { comments: "HEHEHEHAsdf", description: "By Jordan aaaaa", endDate: "2024-08-31", id: "FmJiYS4JtlQslStnTkog", isMilestone: false, links: "sdfaPLS", name: "Task", owners: ["Blah"], startDate: "2024-08-07", status: "InProgress" },
    { comments: "wow", description: "By John wow", endDate: "2024-09-20", id: "FmJiYS4JtlQslStnTkoh", isMilestone: true, links: "asd", name: "Task 2", owners: ["Blah"], startDate: "2024-09-07", status: "Backlog" },
    { comments: "done task", description: "By Alex", endDate: "2024-09-12", id: "FmJiYS4JtlQslStnTkop", isMilestone: false, links: "asd", name: "Task 3", owners: ["John"], startDate: "2024-09-07", status: "Done" },
  ];

  const events = dummyTasks.map(task => ({
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
      <hr /><br/>
      <div style={{flexGrow: '1', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', width: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => alert(`Task: ${event.title}\nDescription: ${event.description}\nStatus: ${event.status}\nOwners: ${event.owners.join(', ')}`)}
        />
      </div>
    </div>
  );
};

export default CalendarView;