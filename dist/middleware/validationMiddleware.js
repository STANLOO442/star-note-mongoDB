"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNote = exports.validateLogin = exports.validateSignup = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation schema for signup
const signupSchema = joi_1.default.object({
    first_name: joi_1.default.string().required(),
    last_name: joi_1.default.string().required(),
    gender: joi_1.default.string().valid('male', 'female', 'other').required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
});
// Validation schema for login
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
});
// Validation schema for note
const noteSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    dueDate: joi_1.default.date().iso(),
    status: joi_1.default.string().valid('pending', 'completed', 'in progress').required(),
    content: joi_1.default.string().required(),
});
const validateSignup = (req, res, next) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateSignup = validateSignup;
const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateLogin = validateLogin;
const validateNote = (req, res, next) => {
    const { error } = noteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateNote = validateNote;
