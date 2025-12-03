import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    deadline: {
        type: Date
    },
    assignedAgent: {
        type: String,
        default: "None"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    result: {
        type: String,
        default: ""
    },

}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);
export default Task