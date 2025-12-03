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

// Get all tasks (user or admin)
export async function getTasks(req, res) {
    try {
        let tasks;
        if (req.user.role === "admin") {

            tasks = await Task.find().populate("createdBy", "firstName lastName email");
        } else {

            tasks = await Task.find({ createdBy: req.user._id });
        }

        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
}

