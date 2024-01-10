"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.getNotes = exports.createNote = void 0;
const Note_1 = __importDefault(require("../models/Note"));
const User_1 = __importDefault(require("../models/User"));
const isValidDueDate = (dueDate) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dueDate);
};
// Create Note
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, dueDate, status, content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const note = yield Note_1.default.create({
            title,
            description,
            dueDate,
            status,
            content,
            userId,
        });
        res.status(201).json({ message: 'Note created successfully', note });
    }
    catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createNote = createNote;
// Get Notes
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { title, fullName } = req.query;
        let query = { userId };
        if (title) {
            query.title = { $regex: new RegExp(title, 'i') };
        }
        if (fullName) {
            const users = yield User_1.default.find({ fullName: { $regex: new RegExp(fullName, 'i') } });
            const userIds = users.map((user) => user.id);
            query.userId = { $in: userIds };
        }
        const notes = yield Note_1.default.find(query);
        res.status(200).json({ notes });
    }
    catch (error) {
        console.error('Error retrieving notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getNotes = getNotes;
// Update Note
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const noteId = req.params.id;
        const { title, description, dueDate, status, content } = req.body;
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
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
        const existingNote = yield Note_1.default.findOne({ _id: noteId, userId });
        if (!existingNote) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        yield existingNote.updateOne({
            title,
            description,
            dueDate,
            status,
            content,
        });
        res.status(200).json({ message: 'Note updated successfully' });
    }
    catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateNote = updateNote;
// Delete Note
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const noteId = req.params.id;
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
        if (!noteId) {
            res.status(400).json({ error: 'Note ID is required' });
            return;
        }
        const existingNote = yield Note_1.default.findOne({ _id: noteId, userId });
        if (!existingNote) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        yield existingNote.deleteOne();
        res.status(200).json({ message: 'Note deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteNote = deleteNote;
// Helper function to validate dueDate format (YYYY-MM-DD)
// ... (assuming you have this function in a helper file)
