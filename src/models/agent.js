import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ["Validation", "Approval", "Notification", "Automation"],
        required: true
    },
    status: {
        type: String,
        enum: ["Available", "Busy", "Offline"],
        default: "Available"
    },
    assignedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }],
    config: {
        type: Object,
        default: {}
    },
    timestamps: true
});

const Agent = mongoose.model("Agent", agentSchema);
export default Agent;