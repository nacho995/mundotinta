const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');

// GET /api/library/user-library - Obtener los libros del usuario
router.get('/user-library', libraryController.getUserBooks);

// GET /api/library/user-favorites - Obtener los libros favoritos del usuario
router.get('/user-favorites', libraryController.getUserFavorites);

// GET /api/library/purchases - Obtener las compras del usuario
router.get('/purchases', libraryController.getPurchases);

module.exports = router;
