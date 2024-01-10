import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Import your Mongoose User model
import { MongoError } from 'mongodb';

const JWT_SECRET = 'your-secret-key'; // Replace with your actual secret key

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { first_name, last_name, gender, email, password } = req.body;

    // Check if all required fields are provided
    if (!first_name || !last_name || !gender || !email || !password) {
      res.status(400).json({ error: 'All fields are required' });
    } else {
      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status  (400).json({ error: 'Invalid email format' });
      } else {
        // Check if the email is not already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          res.status(409).json({ error: 'Email is already registered. Please login.' });
        } else {
          // Save user information to the database
          const newUser = new User({
            first_name,
            last_name,
            gender,
            email,
            password,
          });

          // Hash the password before saving
          await newUser.hashPassword();
          // Save the user with the hashed password
          await newUser.save();

          res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
        }
      }
    }
     } catch (error: any) {
    console.error('Error signing up:', error);

    if (error instanceof MongoError && error.code === 11000) {
      // Extract the duplicate key information from the error message
      const duplicateKeyInfo = error.message.match(/index: (.+?) dup key/);

      if (duplicateKeyInfo && duplicateKeyInfo.length > 1) {
        const field = duplicateKeyInfo[1];
        res.status(409).json({ error: `${field} is already in use. Please choose a different value.` });
      } else {
        // If unable to extract field information, provide a general error message
        res.status(409).json({ error: 'Duplicate key violation. Please choose a different value.' });
      }
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate JWT token upon successful login
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    // Set the token in the cookies
    res.cookie('token', token, { httpOnly: true });

    // Return the user's email, first_name, last_name, and the token
    res.status(200).json({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default { signup, login };
