import React, { useRef, useState } from 'react';
import Togglable from './Togglable';

export default function NoteForm ({ addNote, handleLogout }) {
  const [newNote, setNewNote] = useState('');
  const togglableRef = useRef();

  const handleChange = e => {
    setNewNote(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();

    const noteObject = {
      content: newNote,
      important: false
    };

    addNote(noteObject);
    setNewNote('');

    togglableRef.current.toggleVisibility();
  }

  return (
    <Togglable buttonLabel='New Note' ref={togglableRef}>
      <h3>Create a New Note</h3>

      <form onSubmit={handleSubmit}>
        <input
          value={newNote}
          onChange={handleChange}
          placeholder='Write your note content'
        />
        <button type="submit">save</button>
      </form>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </Togglable>
  );
}
