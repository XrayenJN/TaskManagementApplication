import { render, fireEvent } from '@testing-library/react';
import NewProjectTaskForm from './NewProjectTaskForm.jsx';
import { expect, jest, test } from '@jest/globals';
import { createNewProjectTaskDocument, getContributors } from '../firebase/firebase';

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

jest.spyOn(NewProjectTaskForm, retrieveContributors).mockImplementation(() => {
    return mockedDatabaseData
})
jest.spyOn(NewProjectTaskForm, app).mockImplementation(() => {
    return null
})


// jest.mock('../firebase/firebase', () => {
//     createNewProjectTaskDocument: jest.fn(() => {
//         return null
//     })
//     getContributors: jest.fn(() => {
//         return null
//     })
// })

it('renders a textarea with placeholder and calls setComments on change', () => {
    
    // const getByPlaceholderText = render(NewProjectTaskForm);
    test
});
