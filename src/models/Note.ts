// models/Note.ts
import mongoose, { Document } from 'mongoose';

const noteSchema = new mongoose.Schema({
  Title: String,
  description: String,
  DueDate: Date,
  status: String,
  content: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export interface NoteDocument extends Document {
  Title: string;
  description: string;
  DueDate: Date;
  status: string;
  content: string;
  userId: string;
}

const Note = mongoose.model<NoteDocument>('Note', noteSchema);

export default Note;
