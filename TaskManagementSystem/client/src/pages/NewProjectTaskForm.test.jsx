import { render, fireEvent } from '@testing-library/react';
import NewProjectTaskForm from './NewProjectTaskForm.jsx';
import { expect, jest, test } from '@jest/globals';

jest.mock('../firebase/firebase', () => {
    createNewProjectTaskDocument: jest.fn()
    getContributors: jest.fn()
})

it('renders a textarea with placeholder and calls setComments on change', () => {
    const getByPlaceholderText = render(NewProjectTaskForm);
    const mockedDatabaseData = [{
        "name": "Ethan Fernandez",
        "email": "efer0018@student.monash.edu"
    }]
    jest.spyOn(NewProjectTaskForm, getContributors).mockImplementation(() => {
        return mockedDatabaseData
    })
    jest.spyOn(NewProjectTaskForm, createNewProjectTaskDocument).mockImplementation(() => {
        return null
    })
});
