import express from 'express';
import { createTask, getTasks, getTaskById, updateTaskStatus, assignAgentToTask } from '../controllers/taskController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const taskRouter = express.Router();

taskRouter.use(authMiddleware);

taskRouter.post('/create', createTask);
taskRouter.get('/all', getTasks);
taskRouter.get('/:id', getTaskById);
taskRouter.put('/:id', updateTaskStatus);
taskRouter.put('/assign/:id', assignAgentToTask);

export default taskRouter;

