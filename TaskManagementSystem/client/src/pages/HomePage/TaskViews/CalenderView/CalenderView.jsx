import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([
    {
      title: 'Task 1',
      start: new Date(),
      end: new Date(),
      allDay: false,
    },
    {
      title: 'Task 2',
      start: new Date(2024, 8, 20, 14, 0),
      end: new Date(2024, 8, 20, 16, 0),
      allDay: false,
    },
  ]);

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
        />
      </div>
    </div>
  );
};

export default CalendarView;