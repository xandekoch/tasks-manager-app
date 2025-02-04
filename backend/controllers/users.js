import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';

export const createUser = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ email, password, name, role, password: passwordHash });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { name, email, password, role },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // remove manager from projects if user stops being a manager
        if (role === 'user') {
            const projectsManagedByUser = await Project.find({ manager: updatedUser._id });
            if (projectsManagedByUser.length > 0) {
                await Project.updateMany(
                    { manager: updatedUser._id },
                    { $set: { manager: null } }
                );
            }
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update tasks assigned to this user
        await Task.updateMany(
            { assignedTo: userId },
            { $set: { assignedTo: null } }
        );

        // Update projects where this user is the manager
        await Project.updateMany(
            { manager: userId },
            { $set: { manager: null } }
        );

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

