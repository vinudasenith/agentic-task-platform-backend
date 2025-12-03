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

// Get a single task by ID
export async function getTaskById(req, res) {
    try {
        const task = await Task.findById(req.params.id).populate("createdBy", "firstName lastName email");

        if (!task) return res.status(404).json({ error: "Task not found" });

        if (req.user.role !== "admin" && task.createdBy._id.toString() !== req.user._id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        res.json(task);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ error: "Failed to fetch task" });
    }
}

// Update task status
export async function updateTaskStatus(req, res) {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ error: "Task not found" });

        // Only creator or admin can update
        if (req.user.role !== "admin" && task.createdBy.toString() !== req.user._id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        task.status = status;
        await task.save();

        res.json({ message: "Task status updated", task });
    } catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ error: "Failed to update task status" });
    }
}

// Assign agent to task (admin only)
export async function assignAgentToTask(req, res) {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        task.assignedAgent = req.body.assignedAgent;
        await task.save();

        res.json({ message: "Agent assigned to task", task });
    } catch (error) {
        console.error("Error assigning agent:", error);
        res.status(500).json({ error: "Failed to assign agent" });
    }
}

