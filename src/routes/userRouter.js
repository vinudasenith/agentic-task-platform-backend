import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.use(authMiddleware);

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/all', getAllUsers);

export default userRouter;