const User = require('../models/User');

exports.createTaskList = async (req, res) => {
    try {
        const user = await User.findOne({ token: req.body.token });
        if(user) {
            const taskList = await user.createTaskList(req.body.taskListName)
            if(taskList) {
                res.status(201).json(taskList.toObject());
                return;
            }
        } 
        res.status(403).json({ message: 'Task list creation error' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error);
    }
}

exports.deleteTaskList = async(req, res) => {
    try {
        const user = await User.findOne({ token: req.body.token });
        if(user) {
            const taskList = await user.deleteTaskList(req.body.taskListId)
            if(taskList) {
                res.status(200).json({ message: 'Task list was deleted' });;
                return;
            }
        } 
        res.status(403).json({ message: 'Task list delete error' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error);
    }
}

exports.updateTaskList = async (req, res) => {
    try {
        const user = await User.findOne({ token: req.body.token });
        if(user) {
            const taskList = await user.updateTaskList(req.body.taskList)
            if(taskList) {
                res.status(200).json({ message: 'Task list was updated' });
                return;
            }
        } 
        res.status(403).json({ message: 'Task list update error' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error);
    }
}

exports.setDefaultTaskList = async (req, res) => {
    try {
        const user = await User.findOne({ token: req.body.token });
        if(user) {
            await user.setDefaultTaskList(req.body.taskListId)
            res.status(200).json({ message: 'Default task list was changed' });
        } 
        else res.status(403).json({ message: 'Error of assigning default task list' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error);
    }
}

exports.addTask = async (req, res) => {
    try {
        const user = await User.findOne({ token: req.body.token });
        if(user) {
            const { taskListId, taskText, taskPriority } = req.body
            const task = await user.addTask(taskListId, taskText, taskPriority)
            if(task) {
                res.status(201).json(task.toObject());
                return;
            }
        } 
        res.status(403).json({ message: 'Task adding error' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error);
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const user = await User.findOne({ token: req.body.token });
        if(user) {
            const { taskListId, taskId } = req.body
            const task = await user.deleteTask(taskListId, taskId)
            if(task) {
                res.status(200).json({ message: 'Task was deleted' });
                return;
            }
        } 
        res.status(403).json({ message: 'Task delete error' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error);
    }
}

exports.updateTask = async (req, res) => {
    try {
        const user = await User.findOne({ token: req.body.token });
        if(user) {
            const { taskListId, task } = req.body
            const updatedTask = await user.updateTask(taskListId, task)
            if(updatedTask) {
                res.status(200).json({ message: 'Task was updated' });
                return;
            }
        } 
        res.status(403).json({ message: 'Task update error' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error);
    }
}