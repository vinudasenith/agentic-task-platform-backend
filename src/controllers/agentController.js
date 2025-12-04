import Agent from "../models/agent";
import Task from "../models/task";

// Create new agent
export async function createAgent(req, res) {
    try {
        const { name, type } = req.body;

        const newAgent = new Agent({ name, type });
        await newAgent.save();

        return res.status(201).json({
            message: "Agent created successfully",
            agent: newAgent,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating agent",
            error: error.message,
        });
    }
}

