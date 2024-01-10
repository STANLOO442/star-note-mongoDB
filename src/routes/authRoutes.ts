import express, { Request, Response } from 'express';
import userController, {signup, login} from '../controller/userController';
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from '../controller/noteController';
import { authenticateUser } from '../middleware/authMiddleware'; // Update import
import User from '../models/User';
import Note from '../models/Note';

const router = express.Router();

// Authentication routes for signup and login
router.post('/signup', userController.signup);
router.post('/login', userController.login);


// Render front-page
router.get('/', (req, res) => {
  console.log('Root URL accessed');
  const locals = {
    title: 'Note App',
    description: 'Express, Node.js, Ejs, MongoDB',
  };
  res.render('index', { locals });
});

router.get('/signup', (req, res) => {
  console.log('Root URL accessed');
  const locals = {
    title: 'Note App',
    description: 'Express, Node.js, Ejs, MongoDB',
  };
  res.render('signup', { locals });
});

router.get('/login', (req, res) => {
  console.log('Root URL accessed');
  const locals = {
    title: 'Note App',
    description: 'Express, Node.js, Ejs, MongoDB',
  };
  res.render('login', { locals });
});

// ... (Existing routes for about, signup, login, etc.)

export default router;
