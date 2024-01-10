"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePersonalDashboard = exports.authenticateUser = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = 'your-secret-key'; // Replace with a strong, random secret key
// Function to generate a JWT token
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, secretKey, {
        expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
    });
};
exports.generateToken = generateToken;
// This middleware checks if the user is authenticated
const authenticateUser = (req, res, next) => {
    var _a;
    // Check if the request has a valid JWT token
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        // Verify the token using the secret key
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        // Attach the decoded user information to the request object
        req.user = decoded;
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        // Token verification failed
        res.status(401).json({ error: 'Unauthorized' });
    }
};
exports.authenticateUser = authenticateUser;
// This middleware checks if the authenticated user is authorized to access the personal dashboard
const authorizePersonalDashboard = (req, res, next) => {
    var _a;
    // Check if the authenticated user matches the requested user's id
    if (req.params.userId === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        // User is authorized, proceed to the next middleware or route handler
        next();
    }
    else {
        // User is not authorized, send a forbidden response
        res.status(403).json({ error: 'Forbidden' });
    }
};
exports.authorizePersonalDashboard = authorizePersonalDashboard;
