import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // for extended matchers like `toBeInTheDocument`
import { BrowserRouter as Router } from 'react-router-dom'; // since Link is used
import { TaskContext } from '../../../../contexts/TaskContext'; // import TaskContext
import KanbanView from './KanBanBoard'; // import the component
import { useParams } from 'react-router-dom';

// Mock the useParams hook to provide a projectId
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
      status: 'Backlog',
      endDate: '2024-12-31',
    },
    {
      name: 'Task 2',
      description: 'Description for Task 2',
      status: 'ToDo',
      endDate: '2024-10-15',
    },
    {
      name: 'Task 3',
      description: 'Description for Task 3',
      status: 'InProgress',
      endDate: '2024-11-01',
    },
    {
      name: 'Task 4',
      description: 'Description for Task 4',
      status: 'Done',
      endDate: '2024-09-30',
    },
  ],
};

// Mock the TaskContext provider
const mockProjectTasks = mockTasks;

// Utility function to render KanbanView with mock context
const renderKanbanView = () => {
  render(
    <TaskContext.Provider value={{ projectTasks: mockProjectTasks }}>
      <Router>
        <KanbanView />
      </Router>
    </TaskContext.Provider>
  );
};

describe('KanbanView', () => {
  beforeEach(() => {
    // Mock the projectId returned by useParams
    useParams.mockReturnValue({ projectId: '1' });
  });

  it('renders the Kanban columns', () => {
    renderKanbanView();

    // Check if the column titles are rendered
    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders tasks in the correct columns', () => {
    renderKanbanView();

    // Check if tasks are rendered in the correct columns
    expect(screen.getByText('Task 1')).toBeInTheDocument(); // Backlog


    // Check task descriptions
    expect(screen.getByText('Description for Task 1')).toBeInTheDocument();
  });

  it('renders the Add task button', () => {
    renderKanbanView();

    // Check if "Add task" button exists
    const addTaskButton = screen.getByText('Add task');
    expect(addTaskButton).toBeInTheDocument();
    expect(addTaskButton.closest('a')).toHaveAttribute('href', '/project/1/new-project-task-form');
  });

  it('renders the Filter and Sort by buttons', () => {
    renderKanbanView();

    // Check if Filter and Sort buttons are present
    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toBeInTheDocument();
  });
});
