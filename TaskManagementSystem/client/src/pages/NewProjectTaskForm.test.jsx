import { render, fireEvent } from '@testing-library/react';
import {NewProjectTaskFrom} from './NewProjectTaskForm.jsx'

// Assuming setComments is a mock function for testing
jest.mock('./path/to/setComments', () => ({ setComments: jest.fn() }));

it('renders a textarea with placeholder and calls setComments on change', () => {
  const { getByPlaceholderText } = render(
    <div style={{ paddingTop: '10px' }}>
      <textarea placeholder="Comments" onChange={(e) => setComments(e.target.value)} />
    </div>
  );

  const textarea = getByPlaceholderText('Comments');
  expect(textarea).toBeInTheDocument();

  fireEvent.change(textarea, { target: { value: 'This is a test comment' } });

  expect(setComments).toHaveBeenCalledTimes(1);
  expect(setComments).toHaveBeenCalledWith('This is a test comment');
});