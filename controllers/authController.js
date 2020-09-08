const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');

exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(403).json({ message: errors.array()[0].msg });
            return
        }

        const passwordHash = await bcryptjs.hash(req.body.password, 10)
        const user = new User({
            email: req.body.email,
            name: req.body.name,
            password: passwordHash
        });
        await user.updateToken();
        const taskList = await user.createTaskList('Common');
        user.config.defaultTaskListId = taskList._id.toString();
        await user.save();
        const objUser = user.toObject();
        delete objUser.password;
        res.status(200).json(objUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error);
    }
}

exports.loginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email });
        if(!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        const isCorrectPassword = await bcryptjs.compare(req.body.password, user.password);
        if(isCorrectPassword) {
            const objUser = user.toObject();
            delete objUser.password;
            res.status(201).json(objUser);
        } else {
            res.status(403).json({ message: 'Wrong password' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error);
    }
}