// ProjectList.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


jest.mock('../../firebase/firebase', () => ({
  checkUsersExists: jest.fn(),
  getContributors: jest.fn(),
  updateProjectContributors: jest.fn(),
  updateUserProject: jest.fn(),
}));

jest.mock('../../contexts/ProjectContext', () =>
({
  
}))

const mockProjects = [
  {
    id: 'project1',
    name: 'Project 1',
    description: 'This is project 1',
    startDate: '2024-09-20',
    endDate: '2024-10-20',
  },
  {
    id: 'project2',
    name: 'Project 2',
    description: 'This is project 2',
    startDate: '2024-09-21',
    endDate: '2024-09-30',
  },
];

const mockContributors = {
  project1: [
    { name: 'John Doe', userId: 'user1' },
  ],
  project2: [],
};

describe('ProjectList component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the list of projects', () => {
    render(<ProjectList projects={mockProjects} contributors={mockContributors} />);

    const projectNames = screen.getAllByText(/Project/i);
    expect(projectNames.length).toBe(2);
  });

  it('should display project details and contributors', () => {
    render(<ProjectList projects={mockProjects} contributors={mockContributors} />);

    const project1Description = screen.getByText(/This is project 1/i);
    const project1Contributors = screen.getByText(/John Doe/i);

    expect(project1Description).toBeInTheDocument();
    expect(project1Contributors).toBeInTheDocument();
  });

  it('should show edit project popup on button click', () => {
    render(<ProjectList projects={mockProjects} contributors={mockContributors} />);

    const editButton = screen.getByRole('button', { name: /Edit Project Details/i });
    fireEvent.click(editButton);

    const popup = screen.getByText(/Edit Project Details/i);
    expect(popup).toBeInTheDocument();
  });

  it('should update project details on save', async () => {
    const mockUpdateDoc = jest.fn().mockResolvedValue({});
    jest.spyOn(window.firebase.firestore, 'doc').mockReturnValue({ update: mockUpdateDoc });

    render(<ProjectList projects={mockProjects} contributors={mockContributors} />);

    const editButton = screen.getByRole('button', { name: /Edit Project Details/i });
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText(/Project Name/i);
    const descriptionInput = screen.getByLabelText(/Project Description/i);
    const saveButton = screen.getByText(/Save/i);

    await userEvent.type(nameInput, 'Updated Project Name');
    await userEvent.type(descriptionInput, 'Updated Project Description');
    fireEvent.click(saveButton);

    expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anyObject(), {
      name: 'Updated Project Name',
      description: 'Updated Project Description',
    });
  });

  it('should show error message if email is invalid for adding contributor', async () => {
    render(<ProjectList projects={mockProjects} contributors={mockContributors} />);

    const editButton = screen.getByRole('button', { name: /Edit Project Details/i });
    fireEvent.click(editButton);

    const emailInput = screen.getByPlaceholderText(/Enter contributor email/i);
    const addButton = screen.getByText(/Add/i);

    await userEvent.type(emailInput, 'invalid_email');
    fireEvent.click(addButton);

    const errorMessage = screen.getByText(/Please enter a valid email./i);
    expect(errorMessage).toBeInTheDocument();
  });

  // Add more tests for other functionalities (e.g., adding contributors, removing contributors)
});