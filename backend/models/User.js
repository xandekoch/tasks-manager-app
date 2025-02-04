import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 128,
    },
    name: {
        type: String,
        default: '',
        min: 2,
        max: 40,
    },
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;