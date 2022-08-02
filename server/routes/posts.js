const express = require('express');
const { getAllUsers, registerUser, getUser, editUser, deleteUser } = require('../controllers/controllerUser');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/getAll').get(getAllUsers);
router.route('/get').get(getUser);
router.route('/edit').post(editUser);
router.route('/delete').post(deleteUser);

module.exports = router;
