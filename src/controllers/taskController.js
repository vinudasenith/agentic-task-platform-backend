import Task from "../models/task";

// create a new task
export async function createTask(req, res) {
    try {
        const data = req.body;

        data.createdBy = req.user._id;

        const newTask = new Task(data);
        await newTask.save();

        res.status(201).json({ message: "Task created successfully" });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

