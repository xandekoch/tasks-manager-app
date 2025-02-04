import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";

export const createProject = async (req, res) => {
    try {
        const { name, description, status, manager } = req.body;

        const existingProject = await Project.findOne({ name });
        if (existingProject) return res.status(400).json({ message: 'Project with this name already exists' });

        const projectManager = manager ? await User.findById(manager) : null;
        if (manager && !projectManager) return res.status(404).json({ message: 'Manager not found' });

        const newProject = new Project({
            name,
            description,
            status,
            manager
        });

        await newProject.save();

        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const { search = '', sort = 'active', page = 1, itemsPerPage = 5 } = req.query;

        const pageNumber = parseInt(page, 10);
        const limit = parseInt(itemsPerPage, 10);

        const statusFilter = sort === 'active' ? 'active' : 'inactive';

        const searchFilter = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { "manager.name": { $regex: search, $options: 'i' } },
            ]
        };

        const projectsQuery = Project.find(searchFilter)
            .populate('manager', 'name')
            .where('status').equals(statusFilter)
            .skip((pageNumber - 1) * limit)
            .limit(limit);

        const totalProjects = await Project.countDocuments({ ...searchFilter, status: statusFilter });

        const projects = await projectsQuery;

        const totalPages = Math.ceil(totalProjects / limit);

        res.status(200).json({ projects, totalPages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate('manager');
        if (!project) return res.status(404).json({ message: 'Project not found' });

        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getManagers = async (req, res) => {
    try {
        const managers = await User.find({ role: 'manager' });
        res.status(200).json({ managers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { name, description, status, manager } = req.body;

        const projectManager = manager ? await User.findById(manager) : null;
        if (manager && !projectManager) return res.status(404).json({ message: 'Manager not found' });

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.projectId,
            { name, description, status, manager },
            { new: true }
        ).populate('manager').populate('tasks');

        if (!updatedProject) return res.status(404).json({ message: 'Project not found' });

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const tasks = await Task.find({ project: project._id });
        if (tasks.length > 0) {
            await Task.deleteMany({ project: project._id });
        }

        await Project.deleteOne(project._id);

        res.status(200).json({ message: 'Project and associated tasks deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
