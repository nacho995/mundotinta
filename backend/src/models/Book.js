const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título del libro es obligatorio.'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'El autor del libro es obligatorio.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La descripción del libro es obligatoria.'],
  },
  price: {
    type: Number,
    required: [true, 'El precio del libro es obligatorio.'],
    min: [0, 'El precio no puede ser negativo.'],
  },
  coverImage: {
    type: String, // URL a la imagen de portada
    default: '/images/default-book-cover.jpg', // Una imagen por defecto
  },
  genre: {
    type: String,
    trim: true,
  },
  isbn: {
    type: String,
    trim: true,
    unique: true, // ISBN debería ser único si lo usamos
    sparse: true, // Permite múltiples documentos con valor null/undefined para isbn
  },
  publisher: {
    type: String,
    trim: true,
  },
  publicationYear: {
    type: Number,
  },
  stock: {
    type: Number,
    required: [true, 'La cantidad en stock es obligatoria.'],
    min: [0, 'El stock no puede ser negativo.'],
    default: 0,
  },
  shopifyProductId: { // ID del producto en Shopify
    type: String,
    trim: true,
  },
  formats: { // Formatos disponibles y sus variantes en Shopify
    type: [{
      type: { type: String, enum: ['physical', 'ebook', 'audiobook'] },
      variantId: String, // ID de la variante en Shopify
      price: Number
    }],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Índices para mejorar el rendimiento de las búsquedas (opcional por ahora)
// bookSchema.index({ title: 'text', author: 'text', genre: 'text' });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book; 