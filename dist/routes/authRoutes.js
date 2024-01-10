"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controller/userController"));
const router = express_1.default.Router();
// Authentication routes for signup and login
router.post('/signup', userController_1.default.signup);
router.post('/login', userController_1.default.login);
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
exports.default = router;
