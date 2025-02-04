import mongoose, { mongo } from "mongoose";

const ProjectSchema = new mongoose.Schema({
    name: {
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
        enum: ['active', 'inactive'],
        default: 'pending',
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    tasks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Task"
    }
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);
export default Project;