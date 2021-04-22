const notesRouter = require('express').Router();
const Note = require('../models/Note');
const User = require('../models/User');
const userExtractor = require('../middleware/userExtractor');

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    name: 1,
    username: 1,
    _id: 0
  });
  res.json(notes);
});

notesRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  
  try {
    const note = await Note.findById(id);
    if (note) return res.json(note);
    res.status(404).end();
  } catch (error) {
    next(error);
  }
});

notesRouter.put('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params;
  const note = req.body;
  
  const newNoteInfo = {
    content: note.content,
    important: note.important
  };
  
  try {
    const result = await Note.findByIdAndUpdate(id, newNoteInfo, { new: true });
    res.json(result); 
  } catch (error) {
    next(error);
  }
});
  
notesRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params;
  
  try {
    await Note.findByIdAndDelete(id);
    res.status(204).end(); 
  } catch (error) {
    next(error);
  }
});

notesRouter.post('/', userExtractor, async (req, res, next) => {
  const { content, important = false } = req.body;
  const { userId } = req;

  const user = await User.findById(userId);
  
  if(!content) {
    return res.status(400).json({
      error: 'required "content" field is missing'
    });
  }
  
  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  });
  
  // ANTES
  //newNote.save().then(savedNote => {
  //res.json(savedNote);
  //}).catch(err => next(err));
  
  try {
    const savedNote = await newNote.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
    res.json(savedNote);  
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;
