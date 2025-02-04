import mongoose from 'mongoose';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

const hashedPassword = "$2a$12$DEjtBzYtw/pzHSKS/.f2Puf.UFwl3b1HbHJi.YQaqUNQ.4v3gPI5." // = admin123

const usersData = [
  { email: 'admin@admin.com', password: hashedPassword, name: 'Admin', role: 'admin' },
  { email: 'bob@domain.com', password: hashedPassword, name: 'Bob', role: 'manager' },
  { email: 'charlie@domain.com', password: hashedPassword, name: 'Charlie', role: 'manager' },
  { email: 'dan@domain.com', password: hashedPassword, name: 'Dan', role: 'manager' },
  { email: 'alice@domain.com', password: hashedPassword, name: 'Alice', role: 'user' },
  { email: 'eve@domain.com', password: hashedPassword, name: 'Eve', role: 'user' },
  { email: 'john@domain.com', password: hashedPassword, name: 'John', role: 'user' },
  { email: 'lily@domain.com', password: hashedPassword, name: 'Lily', role: 'user' },
  { email: 'lucas@domain.com', password: hashedPassword, name: 'Lucas', role: 'user' },
  { email: 'mia@domain.com', password: hashedPassword, name: 'Mia', role: 'user' },
];

const projectsData = [
  { name: 'Project A', description: 'Description for Project A', status: 'active' },
  { name: 'Project B', description: 'Description for Project B', status: 'inactive' },
  { name: 'Project C', description: 'Description for Project C', status: 'active' },
];

const tasksData = [
  { title: 'Task 1', description: 'Description for Task 1', status: 'pending' },
  { title: 'Task 2', description: 'Description for Task 2', status: 'in-progress' },
  { title: 'Task 3', description: 'Description for Task 3', status: 'completed' },
  { title: 'Task 4', description: 'Description for Task 4', status: 'pending' },
  { title: 'Task 5', description: 'Description for Task 5', status: 'in-progress' },

  { title: 'Task 6', description: 'Description for Task 6', status: 'completed' },
  { title: 'Task 7', description: 'Description for Task 7', status: 'pending' },
  { title: 'Task 8', description: 'Description for Task 8', status: 'in-progress' },
  { title: 'Task 9', description: 'Description for Task 9', status: 'pending' },
  { title: 'Task 10', description: 'Description for Task 10', status: 'completed' },

  { title: 'Task 11', description: 'Description for Task 11', status: 'pending' },
  { title: 'Task 12', description: 'Description for Task 12', status: 'completed' },
  { title: 'Task 13', description: 'Description for Task 13', status: 'in-progress' },
  { title: 'Task 14', description: 'Description for Task 14', status: 'pending' },
  { title: 'Task 15', description: 'Description for Task 15', status: 'completed' },
];

export const initializeDb = async () => {
  try {
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log('Populating users...');
    const users = await User.insertMany(usersData);
    console.log(`${users.length} users created`);

    console.log('Populating projects...');
    const projects = await Project.insertMany(projectsData);
    console.log(`${projects.length} projects created`);

    console.log('Populating tasks...');
    const tasks = await Task.insertMany(tasksData);
    console.log(`${tasks.length} tasks created`);

    const managerBob = users[1]._id;
    const managerCharlie = users[2]._id;
    const managerDan = users[3]._id;

    await Project.updateOne({ name: 'Project A' }, { manager: managerBob });
    await Project.updateOne({ name: 'Project B' }, { manager: managerCharlie });
    await Project.updateOne({ name: 'Project C' }, { manager: managerDan });

    const projectA = projects[0]._id;
    const projectB = projects[1]._id;
    const projectC = projects[2]._id;

    const task1 = tasks[0]._id;
    const task2 = tasks[1]._id;
    const task3 = tasks[2]._id;
    const task4 = tasks[3]._id;
    const task5 = tasks[4]._id;

    const task6 = tasks[5]._id;
    const task7 = tasks[6]._id;
    const task8 = tasks[7]._id;
    const task9 = tasks[8]._id;
    const task10 = tasks[9]._id;

    const task11 = tasks[10]._id;
    const task12 = tasks[11]._id;
    const task13 = tasks[12]._id;
    const task14 = tasks[13]._id;
    const task15 = tasks[14]._id;

    const userAlice = users[4]._id;
    const userEve = users[5]._id;
    const userJohn = users[6]._id;
    const userLily = users[7]._id;
    const userLucas = users[8]._id;
    const userMia = users[9]._id;

    await Task.updateOne({ _id: task1 }, { project: projectA, assignedTo: userAlice });
    await Task.updateOne({ _id: task2 }, { project: projectA, assignedTo: userEve });
    await Task.updateOne({ _id: task3 }, { project: projectA, assignedTo: userJohn });
    await Task.updateOne({ _id: task4 }, { project: projectA, assignedTo: userLily });
    await Task.updateOne({ _id: task5 }, { project: projectA, assignedTo: userLucas });

    await Task.updateOne({ _id: task6 }, { project: projectB, assignedTo: userAlice });
    await Task.updateOne({ _id: task7 }, { project: projectB, assignedTo: userMia });
    await Task.updateOne({ _id: task8 }, { project: projectB, assignedTo: userLucas });
    await Task.updateOne({ _id: task9 }, { project: projectB });
    await Task.updateOne({ _id: task10 }, { project: projectB });

    await Task.updateOne({ _id: task11 }, { project: projectC, assignedTo: userJohn });
    await Task.updateOne({ _id: task12 }, { project: projectC, assignedTo: userEve });
    await Task.updateOne({ _id: task13 }, { project: projectC });
    await Task.updateOne({ _id: task14 }, { project: projectC });
    await Task.updateOne({ _id: task15 }, { project: projectC, assignedTo: userMia });

    await Project.updateOne({ _id: projectA }, { $set: { tasks: [task1, task2, task3, task4, task5] } });
    await Project.updateOne({ _id: projectB }, { $set: { tasks: [task6, task7, task8, task9, task10] } });
    await Project.updateOne({ _id: projectC }, { $set: { tasks: [task11, task12, task13, task14, task15] } });

    console.log('Database populated successfully!');
  } catch (error) {
    console.error('Error populating the database:', error);
  } finally {
    mongoose.connection.close();
  }
};