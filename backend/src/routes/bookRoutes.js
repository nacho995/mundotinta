const express = require('express');
const router = express.Router();
const { getBooks, getBookById, getUserFavorites } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Rutas para los libros
// @route   /api/books

router.route('/').get(getBooks);
router.route('/favorites').get(protect, getUserFavorites); // Ruta protegida para favoritos
router.route('/:id').get(getBookById);

module.exports = router; 