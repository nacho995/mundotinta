const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const { validateRegistration, validateLogin } = require('../middleware/validators'); // Opcional: para validación más robusta

// POST /api/auth/register - Registrar un nuevo usuario
router.post('/register', /* validateRegistration, */ authController.registerUser);

// POST /api/auth/login - Iniciar sesión
router.post('/login', /* validateLogin, */ authController.loginUser);

// POST /api/auth/forgot-password - Solicitar reseteo de contraseña
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password - Resetear la contraseña con un token
router.post('/reset-password', authController.resetPassword);

// GET /api/auth/verify-email - Verificar email de usuario
router.get('/verify-email', authController.verifyEmail);

// GET /api/auth/me - (Opcional) Obtener datos del usuario autenticado (requiere middleware de autenticación)
// router.get('/me', authMiddleware.protect, authController.getMe);

module.exports = router; 