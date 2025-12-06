import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

// public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// private routes
userRouter.get('/all', authMiddleware, getAllUsers);

export default userRouter;