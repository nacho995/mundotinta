const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/user/profile - Obtener perfil del usuario
router.get('/profile', userController.getUserProfile);

module.exports = router;
