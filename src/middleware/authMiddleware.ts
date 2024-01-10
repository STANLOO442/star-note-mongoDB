// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


// Extend the Request interface to include the 'user' property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

const secretKey = 'your-secret-key'; // Replace with a strong, random secret key

// Function to generate a JWT token
export const generateToken = (user: { id: string; username: string }) => {
  return jwt.sign({ id: user.id, username: user.username }, secretKey, {
    expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
  });
};

// This middleware checks if the user is authenticated
export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Check if the request has a valid JWT token
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, secretKey) as { id: string; username: string };

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Token verification failed
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// This middleware checks if the authenticated user is authorized to access the personal dashboard
export const authorizePersonalDashboard = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Check if the authenticated user matches the requested user's id
  if (req.params.userId === req.user?.id) {
    // User is authorized, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authorized, send a forbidden response
    res.status(403).json({ error: 'Forbidden' });
  }
};


