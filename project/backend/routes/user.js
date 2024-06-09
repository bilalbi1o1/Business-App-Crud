const express = require('express');
const { handleGetAllUsers, handleGetUserByRef, handleUpdateUserByRef, handleDeleteUserByRef, handleCreateNewUser } = require('../controllers/user');

const router = express.Router();

router.get('/', handleGetAllUsers);
router.get('/:ref', handleGetUserByRef);
router.post('/', handleCreateNewUser);
router.patch('/:ref', handleUpdateUserByRef);
router.delete('/:ref', handleDeleteUserByRef);

module.exports = router;