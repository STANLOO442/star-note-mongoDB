"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Note.ts
const mongoose_1 = __importDefault(require("mongoose"));
const noteSchema = new mongoose_1.default.Schema({
    Title: String,
    description: String,
    DueDate: Date,
    status: String,
    content: String,
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
});
const Note = mongoose_1.default.model('Note', noteSchema);
exports.default = Note;
