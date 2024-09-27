// NewProjectTaskForm.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import NewProjectTaskForm from './NewProjectTaskForm';
import { TaskContext } from '../contexts/TaskContext';
import { createNewProjectTaskDocument, getContributors } from '../firebase/firebase';
import { ProjectTask } from '../models/ProjectTask';

// Mocking Firebase functions
jest.mock('../firebase/firebase', () => ({
  createNewProjectTaskDocument: jest.fn(),
  getContributors: jest.fn(),
}));

describe('NewProjectTaskForm', () => {
  const mockRefreshTasks = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getContributors.mockResolvedValue([
      { name: 'Contributor 1', email: 'contributor1@example.com' },
      { name: 'Contributor 2', email: 'contributor2@example.com' },
    ]);
  });

  it('renders the form and allows input', async () => {
    render(
      <TaskContext.Provider value={{ refreshTasks: mockRefreshTasks }}>
        <MemoryRouter initialEntries={['/project/123/tasks/new']}>
          <Route path="/project/:projectId/tasks/new">
            <NewProjectTaskForm />
          </Route>
        </MemoryRouter>
      </TaskContext.Provider>
    );

    expect(await screen.findByText('Create New Project Task')).toBeInTheDocument();

    // Check if the form inputs exist
    expect(screen.getByPlaceholderText('Project Task name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Comments')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Links')).toBeInTheDocument();

    // Check if select options are populated
    expect(screen.getByRole('combobox', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /owners/i })).toBeInTheDocument();

    // Enter data into the form
    fireEvent.change(screen.getByPlaceholderText('Project Task name'), {
      target: { value: 'New Test Task' },
    });
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Test Description' },
    });
    fireEvent.change(screen.getByPlaceholderText('Comments'), {
      target: { value: 'Test Comments' },
    });
    fireEvent.change(screen.getByPlaceholderText('Links'), {
      target: { value: 'https://example.com' },
    });
    fireEvent.click(screen.getByLabelText('Milestone'));
    fireEvent.change(screen.getByRole('combobox', { name: /status/i }), {
      target: { value: 'InProgress' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: /owners/i }), {
      target: { value: 'contributor1@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Start Date:'), {
      target: { value: '2024-10-01' },
    });
    fireEvent.change(screen.getByLabelText('End Date:'), {
      target: { value: '2024-10-10' },
    });

    // Submitting the form
    fireEvent.submit(screen.getByRole('button', { name: /create project task/i }));

    // Check if createNewProjectTaskDocument was called with the right parameters
    await waitFor(() => {
      expect(createNewProjectTaskDocument).toHaveBeenCalledWith(
        expect.any(ProjectTask),
        '123'
      );
    });

    // Check if refreshTasks was called
    expect(mockRefreshTasks).toHaveBeenCalledTimes(1);
  });

  it('validates the form submission', async () => {
    render(
      <TaskContext.Provider value={{ refreshTasks: mockRefreshTasks }}>
        <MemoryRouter initialEntries={['/project/123/tasks/new']}>
          <Route path="/project/:projectId/tasks/new">
            <NewProjectTaskForm />
          </Route>
        </MemoryRouter>
      </TaskContext.Provider>
    );

    // Submitting the form without filling in the required fields
    fireEvent.submit(screen.getByRole('button', { name: /create project task/i }));

    await waitFor(() => {
      expect(createNewProjectTaskDocument).not.toHaveBeenCalled();
    });

    // Fill the required fields and resubmit
    fireEvent.change(screen.getByPlaceholderText('Project Task name'), {
      target: { value: 'Test Task' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: /status/i }), {
      target: { value: 'Ready' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: /owners/i }), {
      target: { value: 'contributor1@example.com' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /create project task/i }));

    await waitFor(() => {
      expect(createNewProjectTaskDocument).toHaveBeenCalledTimes(1);
      expect(mockRefreshTasks).toHaveBeenCalledTimes(1);
    });
  });
});
