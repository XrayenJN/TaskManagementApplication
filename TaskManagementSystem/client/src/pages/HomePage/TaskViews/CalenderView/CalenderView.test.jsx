import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { TaskContext } from '../../../../contexts/TaskContext';
import CalendarView from './CalenderView';
import { useParams } from 'react-router-dom';

// Mock useParams to provide a projectId
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

// Mock data for tasks
const mockTasks = {
  '1': [
    {
      name: 'Task 1',
      description: 'Description for Task 1',
      status: 'InProgress',
      endDate: '2024-12-31',
      owners: ['Alice', 'Bob'],
      isMilestone: false,
    },
    {
      name: 'Task 2',
      description: 'Description for Task 2',
      status: 'Done',
      endDate: '2024-10-15',
      owners: ['Charlie'],
      isMilestone: true,
    },
  ],
};

// Mock the TaskContext provider
const mockProjectTasks = mockTasks;

// Utility function to render CalendarView with mock context
const renderCalendarView = () => {
  render(
    <TaskContext.Provider value={{ projectTasks: mockProjectTasks }}>
      <Router>
        <CalendarView />
      </Router>
    </TaskContext.Provider>
  );
};

describe('CalendarView', () => {
  beforeEach(() => {
    // Mock the projectId returned by useParams
    useParams.mockReturnValue({ projectId: '1' });
  });

  it('renders the Calendar view', () => {
    renderCalendarView();

    // Check if the calendar header and button are rendered
    expect(screen.getByText('Calendar View')).toBeInTheDocument();
    const addTaskButton = screen.getByText('Add task');
    expect(addTaskButton).toBeInTheDocument();
    expect(addTaskButton.closest('a')).toHaveAttribute('href', '/project/1/new-project-task-form');
  });


});
