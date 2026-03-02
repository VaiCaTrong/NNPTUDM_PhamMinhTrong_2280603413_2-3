const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Enable/Disable operations (must be before /:id routes)
router.post('/enable', userController.enableUser);
router.post('/disable', userController.disableUser);

// CRUD operations
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
