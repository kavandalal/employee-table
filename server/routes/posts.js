const express = require('express');
const { getAllUsers, registerUser, getUser, editUser, deleteUser } = require('../controllers/controllerUser');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/getAll').post(getAllUsers);
router.route('/get/:username').get(getUser);
router.route('/edit').post(editUser);
router.route('/delete/:username').get(deleteUser);

module.exports = router;
