import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import Note from './Note';

test('renders content', () => {
  const note = {
    content: 'This a test',
    important: false
  };

  const component = render(<Note note={note} />);

  component.getByText('This a test');
  component.getByText('make important');
  //expect(component.container).toHaveTextContent(note.content);
});

test('clicking the button calls event handler once', () => {
  const note = {
    content: 'This a test',
    important: true
  };

  const mockHandler = jest.fn();

  const component = render(<Note note={note} toggleImportance={mockHandler} />);

  const button = component.getByText('make not important');
  fireEvent.click(button);

  expect(mockHandler).toHaveBeenCalledTimes(1);
});
