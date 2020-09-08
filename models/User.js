const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: String,
    config: {
        default: {},
        defaultTaskListId: String
    },
    taskLists: [
        {
            name: {
                type: String,
                required: true
            },
            items: [
                {
                    text: {
                        type: String,
                        required: true
                    },
                    priority: {
                        type: Number,
                        required: true
                    },
                    completed: {
                        type: Boolean,
                        required: true
                    },
                    createdAt: {
                        type: Date,
                        required: true
                    }
                }
            ]
        }
    ]
}, { timestamps: true });

userSchema.methods.updateToken = async function() {
    this.token =  this.email + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await this.save();
}

userSchema.methods.createTaskList = async function (name) {
    const lastItemNumber = this.taskLists.push({
        name,
        items: []
    });
    await this.save();
    return this.taskLists[lastItemNumber - 1];
}

userSchema.methods.deleteTaskList = async function(taskListId) {
    const index = this.taskLists.findIndex(tl => tl._id.toString() === taskListId);
    if(index >= 0) {
        const deleted = (this.taskLists.splice(index, 1))[0];
        await this.save();
        return deleted;
    } 
    else return null;
}

userSchema.methods.updateTaskList = async function(taskList) {
    const foundTaskList = this.taskLists.find(tl => tl._id.toString() === taskList._id);
    if(foundTaskList) {
        delete taskList._id;
        Object.assign(foundTaskList, taskList);
        await this.save();
        return foundTaskList;
    } 
    else return null;
}

userSchema.methods.setDefaultTaskList = async function(taskListId) {
    this.config.defaultTaskListId = taskListId;
    return await this.save()
}

userSchema.methods.addTask = async function(taskListId, text, priority) {
    const taskList = this.taskLists.find(tl => tl._id.toString() === taskListId);
    if(taskList) {
        const lastItemNumber = taskList.items.push({
            text,
            priority,
            completed: false,
            createdAt: (new Date()).toISOString()
        });
        await this.save();
        return taskList.items[lastItemNumber - 1];
    } 
    else return null;
}

userSchema.methods.deleteTask = async function(taskListId, taskId) {
    const taskList = this.taskLists.find(tl => tl._id.toString() === taskListId);
    if(taskList) {
        const index = taskList.items.findIndex(t => t._id.toString() === taskId);
        if(index >= 0) {
            const deleted = (taskList.items.splice(index, 1))[0];
            await this.save();
            return deleted;
        }
    } 
    else return null;
}

userSchema.methods.updateTask = async function(taskListId, task) {
    const taskList = this.taskLists.find(tl => tl._id.toString() === taskListId);
    if(taskList) {
        const foundTask = taskList.items.find(t => t._id.toString() === task._id);
        if(foundTask) {
            delete task._id;
            Object.assign(foundTask, task);
            await this.save();
            return task;
        }
    } 
    else return null;
}

module.exports = model('User', userSchema);