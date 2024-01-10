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
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User")); // Import your Mongoose User model
const mongodb_1 = require("mongodb");
const JWT_SECRET = 'your-secret-key'; // Replace with your actual secret key
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, gender, email, password } = req.body;
        // Check if all required fields are provided
        if (!first_name || !last_name || !gender || !email || !password) {
            res.status(400).json({ error: 'All fields are required' });
        }
        else {
            // Check if email is valid
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({ error: 'Invalid email format' });
            }
            else {
                // Check if the email is not already registered
                const existingUser = yield User_1.default.findOne({ email });
                if (existingUser) {
                    res.status(409).json({ error: 'Email is already registered. Please login.' });
                }
                else {
                    // Save user information to the database
                    const newUser = new User_1.default({
                        first_name,
                        last_name,
                        gender,
                        email,
                        password,
                    });
                    // Hash the password before saving
                    yield newUser.hashPassword();
                    // Save the user with the hashed password
                    yield newUser.save();
                    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
                }
            }
        }
    }
    catch (error) {
        console.error('Error signing up:', error);
        if (error instanceof mongodb_1.MongoError && error.code === 11000) {
            // Extract the duplicate key information from the error message
            const duplicateKeyInfo = error.message.match(/index: (.+?) dup key/);
            if (duplicateKeyInfo && duplicateKeyInfo.length > 1) {
                const field = duplicateKeyInfo[1];
                res.status(409).json({ error: `${field} is already in use. Please choose a different value.` });
            }
            else {
                // If unable to extract field information, provide a general error message
                res.status(409).json({ error: 'Duplicate key violation. Please choose a different value.' });
            }
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if the user exists in the database
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Compare the entered password with the hashed password in the database
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Generate JWT token upon successful login
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET);
        // Set the token in the cookies
        res.cookie('token', token, { httpOnly: true });
        // Return the user's email, first_name, last_name, and the token
        res.status(200).json({
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            token,
        });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.login = login;
exports.default = { signup: exports.signup, login: exports.login };
