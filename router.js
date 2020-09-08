const {Router} = require('express');
const authController = require('./controllers/authController');
const taskController = require('./controllers/taskController');
const router = Router();
const { registerValidator } = require('./utils/validators');

//#region AUTH ROUTES
router.post('/register', registerValidator, authController.registerUser);
router.post('/login', authController.loginUser);
//#endregion

//#region TASKS ROUTES
router.post('/task-list', taskController.createTaskList);
router.delete('/task-list', taskController.deleteTaskList);
router.put('/task-list', taskController.updateTaskList)
router.put('/default-task-list', taskController.setDefaultTaskList)

router.post('/task', taskController.addTask);
router.delete('/task', taskController.deleteTask);
router.put('/task', taskController.updateTask);
//#endregion

module.exports = router;