import express from "express";
import { createAgent, getAgent } from "../controllers/agentController";
import authMiddleware from "../middlewares/authMiddleware";

const agentRouter = express.Router();
agentRouter.use(authMiddleware);

agentRouter.post("/create", createAgent);
agentRouter.get("/all", getAgent);

export default agentRouter;