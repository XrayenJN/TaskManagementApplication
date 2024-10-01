import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // for extended matchers like `toBeInTheDocument`
import { BrowserRouter as Router } from 'react-router-dom'; // since you use Links
import { ProjectContext } from '../../contexts/ProjectContext'; // import ProjectContext
import ProjectList from './HomeView'; // import the component

// Mock project data
const mockProjects = {
  '1': {
    id: '1',
    name: 'Project One',
    description: 'Description for Project One',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
  },
  '2': {
    id: '2',
    name: 'Project Two',
    description: 'Description for Project Two',
    startDate: '2023-02-01',
    endDate: '2023-11-30',
  },
};

// Mock contributor data
const mockContributors = {
  '1': [{ name: 'John Doe' }],
  '2': [{ name: 'Jane Smith' }],
};

const mockSetChosenProjectId = jest.fn(); // mock the setChosenProjectId function

// Utility function to render ProjectList with mock context
const renderProjectList = () => {
  render(
    <ProjectContext.Provider value={{
      projects: mockProjects,
      contributors: mockContributors,
      setChosenProjectId: mockSetChosenProjectId,
    }}>
      <Router>
        <ProjectList />
      </Router>
    </ProjectContext.Provider>
  );
};

describe('ProjectList', () => {
  it('renders the project titles and descriptions', () => {
    renderProjectList();

    // Check if project names are rendered
    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('Project Two')).toBeInTheDocument();

    // Check if project descriptions are rendered
    expect(screen.getByText('Description for Project One')).toBeInTheDocument();
    expect(screen.getByText('Description for Project Two')).toBeInTheDocument();
  });

  it('renders contributors for each project', () => {
    renderProjectList();

    // Check if contributors are listed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it('renders the Add Project button', () => {
    renderProjectList();

    // Check if "Add Project" button exists
    expect(screen.getByText('Add Project')).toBeInTheDocument();
  });

  it('renders the edit project button for each project', () => {
    renderProjectList();

    // Check if "Edit Project Details" buttons exist for each project
    const editButtons = screen.getAllByText('Edit Project Details');
    expect(editButtons.length).toBe(2); // one for each project
  });

  it('renders project dates correctly', () => {
    renderProjectList();

    // Check if start and end dates for both projects are rendered
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("2023-12-31")).toBeInTheDocument();

    expect(screen.getByText("2023-02-01")).toBeInTheDocument();
    expect(screen.getByText("2023-11-30")).toBeInTheDocument();
  });
});
