// controllers/noteController.ts
import { Response } from 'express';
import Note, { NoteDocument } from '../models/Note';
import User, {UserDocument}  from '../models/User';



 interface Request {
    body: { title: any; description: any; dueDate: any; status: any; content: any; };
    query: { title: any; fullName: any; };
    params: any;
    user?: { id: string }; // Adjust the type according to your user structure
  }


  const isValidDueDate = (dueDate: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dueDate);
};

// Create Note
export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate, status, content } = req.body;
    const userId = req.user?.id;

    if (!title || !description || !status || !userId || !content) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const validStatusValues = ['Pending', 'InProgress', 'Completed'];
    if (!validStatusValues.includes(status)) {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }

    if (dueDate && !isValidDueDate(dueDate)) {
      res.status(400).json({ error: 'Invalid dueDate format' });
      return;
    }

    const note: NoteDocument = await Note.create({
      title,
      description,
      dueDate,
      status,
      content,
      userId,
    });

    res.status(201).json({ message: 'Note created successfully', note });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get Notes
export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, fullName } = req.query;

    let query: Record<string, any> = { userId };

    if (title) {
      query.title = { $regex: new RegExp(title, 'i') };
    }

    if (fullName) {
      const users = await User.find({ fullName: { $regex: new RegExp(fullName, 'i') } });
      const userIds = users.map((user) => user.id);
      query.userId = { $in: userIds };
    }

    const notes = await Note.find(query);

    res.status(200).json({ notes });
  } catch (error) {
    console.error('Error retrieving notes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Note
export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const noteId = req.params.id;
    const { title, description, dueDate, status, content } = req.body;
    const userId = req.user?.id;

    if (!title || !description || !status || !userId || !noteId || !content) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const validStatusValues = ['Pending', 'InProgress', 'Completed'];
    if (!validStatusValues.includes(status)) {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }

    if (dueDate && !isValidDueDate(dueDate)) {
      res.status(400).json({ error: 'Invalid dueDate format' });
      return;
    }

    const existingNote: NoteDocument | null = await Note.findOne({ _id: noteId, userId });

    if (!existingNote) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    await existingNote.updateOne({
      title,
      description,
      dueDate,
      status,
      content,
    });

    res.status(200).json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Note
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const noteId = req.params.id;
    const userId = req.user?.id;

    if (!noteId) {
      res.status(400).json({ error: 'Note ID is required' });
      return;
    }

    const existingNote: NoteDocument | null = await Note.findOne({ _id: noteId, userId });

    if (!existingNote) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    await existingNote.deleteOne();

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to validate dueDate format (YYYY-MM-DD)
// ... (assuming you have this function in a helper file)
