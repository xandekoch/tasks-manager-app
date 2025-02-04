import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        min: 6,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);
export default Task;