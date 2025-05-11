const express = require('express');
const router = express.Router();
const { getBooks, getBookById } = require('../controllers/bookController');

// @desc    Rutas para los libros
// @route   /api/books

router.route('/').get(getBooks);
router.route('/:id').get(getBookById);

module.exports = router; 