const mongoose = require('mongoose');
const { server } = require('../index');
const Note = require('../models/Note');
const { initialNotes, api, getAllContentFromNotes } = require('./helpers');

beforeEach(async () => {
  await Note.deleteMany({});

  for (const note of initialNotes) {
    const noteObject = new Note(note);
    await noteObject.save();
  }
});

test('notes are returned as json', async done => {
  await api.get('/api/notes').expect(200).expect('Content-Type', /application\/json/);
  done();
});

test('there are two notes', async done => {
  const response = await api.get('/api/notes');
  expect(response.body).toHaveLength(initialNotes.length);
  done();
});

test('one note is about midudev', async done => {
  const { contents } = await getAllContentFromNotes();
  expect(contents).toContain('Aprendiendo fullstack con midudev');
  done();
});

test('a valid note can be added', async done => {
  const newNote = {
    content: 'Proximamente async/await',
    important: true,
  };

  await api.post('/api/notes').send(newNote).expect(200).expect('Content-Type', /application\/json/);
  const { contents, response } = await getAllContentFromNotes();

  expect(response.body).toHaveLength(initialNotes.length + 1);
  expect(contents).toContain(newNote.content);
  done();
});

test('note without content is not valid', async done => {
  const newNote = {
    important: true
  };
  await api.post('/api/notes').send(newNote).expect(400);

  const response = await api.get('/api/notes');
  expect(response.body).toHaveLength(initialNotes.length);
  done();
});

test('a note can be deleted', async done => {
  const { response: firstResponse } = await getAllContentFromNotes();
  const { body: notes } = firstResponse;
  // PONER EL noteToDelete ENTRE [] HACE QUE EN noteToDelete SE GUARDE EL PRIMER ELEMENTO DEL ARRAY notes
  const [noteToDelete] = notes;
  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const { contents, response: secondResponse } = await getAllContentFromNotes();
  expect(secondResponse.body).toHaveLength(initialNotes.length - 1);
  expect(contents).not.toContain(noteToDelete.content);
  done();
});

test('a note cannot be deleted', async done => {
  await api.delete('/api/notes/1234').expect(500);

  const { response } = await getAllContentFromNotes();
  expect(response.body).toHaveLength(initialNotes.length);
  done();
});

test('a note can be updated', async done => {
  const { response: firstResponse } = await getAllContentFromNotes();
  const { body: notes } = firstResponse;
  const [noteToUpdate] = notes;

  const newNoteInfo = {
    content: 'Update de prueba',
    important: true
  };

  await api.put(`/api/notes/${noteToUpdate.id}`).send(newNoteInfo).expect(200).expect('Content-Type', /application\/json/);

  const { response: secondResponse } = await getAllContentFromNotes();
  expect(secondResponse.body).toHaveLength(initialNotes.length);

  done();
});

afterAll(done => {
  mongoose.connection.close();
  server.close(done);
});
