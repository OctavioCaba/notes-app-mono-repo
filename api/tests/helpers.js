const supertest = require('supertest');
const { app } = require('../index');
const api = supertest(app);
const User = require('../models/User');

const initialNotes = [
  {
    content: 'Aprendiendo fullstack con midudev',
    important: true,
    date: new Date()
  },
  {
    content: 'Suscribiete a mi canal de yt',
    important: false,
    date: new Date()
  }
];

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes');
  return {
    contents: response.body.map(note => note.content),
    response
  };
};

const getUsers = async () => {
  const usersDB = await User.find({});
  return usersDB.map(user => user.toJSON());
};

module.exports = { initialNotes, api, getAllContentFromNotes, getUsers };
