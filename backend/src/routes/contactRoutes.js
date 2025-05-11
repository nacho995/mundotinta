const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Ruta para el envío del formulario de contacto
// POST /api/contact/send
router.post('/send', contactController.handleContactForm);

module.exports = router; 