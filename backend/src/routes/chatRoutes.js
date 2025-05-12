const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Ruta principal para consultas al chatbot con IA
router.post('/query', chatController.processQuery);

// Ruta para verificar el estado de Ollama
router.get('/status', chatController.checkOllamaStatus);

// Ruta para descargar el modelo si no está disponible
router.post('/download-model', chatController.downloadModel);

module.exports = router;
