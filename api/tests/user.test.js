const mongoose = require('mongoose');
const { server } = require('../index');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { api, getUsers } = require('./helpers');

describe('creating a new user',() => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('pswd', 10);
    const user = new User({ username: 'octaroot', passwordHash });

    await user.save();
  });
});

test('works as expected creating a fresh username', async done => {
  const usersAtStart = await getUsers();
  const newUser = {
    username: 'Minena',
    name: 'Milena',
    password: 'cooper2518'
  };

  await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/);

  const usersAtEnd = await getUsers();

  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

  const usernames = usersAtEnd.map(u => u.username);
  expect(usernames).toContain(newUser.username);
  done();
});

test('creation fails with proper statuscode and message if username is already taken', async done => {
  const usersAtStart = await getUsers();
  const newUser = {
    username: 'octaroot',
    name: 'Monavio',
    password: 'admintest'
  };

  const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/);

  expect(result.body.errors.username.message).toContain('`username` to be unique');

  const usersAtEnd = await getUsers();
  expect(usersAtEnd).toHaveLength(usersAtStart.length);
  done();
});

afterAll(done => {
  mongoose.connection.close();
  server.close(done);
});
