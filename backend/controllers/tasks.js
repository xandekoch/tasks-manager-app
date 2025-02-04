import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const createTask = async (req, res) => {
    try {
        const { title, description, status, project, assignedTo } = req.body;

        const projectExists = await Project.findById(project);
        if (!projectExists) return res.status(404).json({ message: 'Project not found' });

        const userId = req.user.userId;
        console.log(userId, projectExists.manager.toString())
        if (projectExists.manager.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: 'You are not authorized to manage this project' });
        }

        const assignedUser = await User.findById(assignedTo);
        if (assignedTo && !assignedUser) return res.status(404).json({ message: 'Assigned user not found' });

        const task = new Task({
            title,
            description,
            status,
            project,
            assignedTo
        });

        await task.save();

        projectExists.tasks.push(task._id);
        await projectExists.save();

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const { search = '', sort = 'pending', page = 1, itemsPerPage = 5, projectId } = req.query;

        const pageNumber = parseInt(page, 10);
        const limit = parseInt(itemsPerPage, 10);

        const statusFilter = sort === 'pending' ? 'pending' : sort === 'in-progress' ? 'in-progress' : 'completed';

        const searchFilter = {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { "assignedTo.name": { $regex: search, $options: 'i' } },
            ]
        };

        const tasksQuery = Task.find(searchFilter)
            .where('project').equals(projectId)
            .populate('assignedTo', 'name')
            .where('status').equals(statusFilter)
            .skip((pageNumber - 1) * limit)
            .limit(limit);

        const totalTaks = await Task.countDocuments({ ...searchFilter, status: statusFilter });

        const tasks = await tasksQuery;

        const totalPages = Math.ceil(totalTaks / limit);

        res.status(200).json({ tasks, totalPages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId).populate('project').populate('assignedTo');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { title, description, status, assignedTo } = req.body;

        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const project = task.project.toString();
        console.log('sakdask', project)

        const projectExists = project ? await Project.findById(project) : null;
        if (project && !projectExists) return res.status(404).json({ message: 'Project not found' });

        const userId = req.user.userId;
        if (projectExists.manager.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: 'You are not authorized to manage this project' });
        }

        const assignedUser = assignedTo ? await User.findById(assignedTo) : null;
        if (assignedTo && !assignedUser) return res.status(404).json({ message: 'Assigned user not found' });

        const oldProject = task.project;

        if (oldProject && oldProject.toString() !== project) { // Remove task from old project if project is updated
            const projectToUpdate = await Project.findById(oldProject);
            if (projectToUpdate) {
                projectToUpdate.tasks = projectToUpdate.tasks.filter(
                    taskId => taskId.toString() !== task._id.toString()
                );
                await projectToUpdate.save();
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            { title, description, status, project, assignedTo },
            { new: true }
        ).populate('project').populate('assignedTo');

        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const project = await Project.findById(task.project);
        if (project) {
            project.tasks = project.tasks.filter(taskId => taskId.toString() !== task._id.toString());
            await project.save();
        }

        await Task.deleteOne(task._id);

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
