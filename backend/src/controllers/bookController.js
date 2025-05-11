// const Book = require('../models/Book'); // Lo usaremos más adelante

// Datos de ejemplo (hardcodeados por ahora)
const sampleBooks = [
  {
    _id: '1',
    title: 'El Nombre del Viento',
    author: 'Patrick Rothfuss',
    description: 'La legendaria historia de Kvothe, un músico y mago.',
    price: 19.99,
    coverImage: '/images/covers/el-nombre-del-viento.jpg',
    genre: 'Fantasía',
    stock: 10,
    amazonPhysicalUrl: 'https://www.amazon.com/dp/0756404746?tag=YOUR_AFFILIATE_TAG-20',
    amazonEbookUrl: 'https://www.amazon.com/dp/B002641W3S?tag=YOUR_AFFILIATE_TAG-20',
  },
  {
    _id: '2',
    title: 'Cien Años de Soledad',
    author: 'Gabriel García Márquez',
    description: 'La saga de la familia Buendía en el mítico pueblo de Macondo.',
    price: 15.50,
    coverImage: '/images/covers/cien-anos-de-soledad.jpg',
    genre: 'Realismo Mágico',
    stock: 5,
    amazonPhysicalUrl: 'https://www.amazon.com/dp/0060883286?tag=YOUR_AFFILIATE_TAG-20',
  },
  {
    _id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'En el lejano planeta desértico Arrakis, la única fuente de la especia melange.',
    price: 22.00,
    coverImage: '/images/covers/dune.jpg',
    genre: 'Ciencia Ficción',
    stock: 12,
    amazonPhysicalUrl: 'https://www.amazon.com/dp/0441172717?tag=YOUR_AFFILIATE_TAG-20',
    amazonEbookUrl: 'https://www.amazon.com/dp/B00B7NPRY8?tag=YOUR_AFFILIATE_TAG-20',
  },
  {
    _id: '4',
    title: '1984',
    author: 'George Orwell',
    description: 'Una sombría visión de un futuro totalitario donde el Gran Hermano todo lo ve.',
    price: 12.75,
    coverImage: '/images/covers/1984.jpg',
    genre: 'Distopía',
    stock: 8,
    amazonEbookUrl: 'https://www.amazon.com/dp/B003JTHWPE?tag=YOUR_AFFILIATE_TAG-20',
  },
];

// @desc    Obtener todos los libros
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    // Por ahora, devolvemos los datos de ejemplo
    // Más adelante, obtendremos los libros de la base de datos:
    // const books = await Book.find({});
    res.json(sampleBooks);
  } catch (error) {
    console.error('Error al obtener los libros:', error);
    res.status(500).json({ message: 'Error del servidor al obtener los libros' });
  }
};

// @desc    Obtener un libro por ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    // Por ahora, buscamos en los datos de ejemplo
    // Más adelante, obtendremos el libro de la base de datos:
    // const book = await Book.findById(req.params.id);
    const book = sampleBooks.find(b => b._id === req.params.id);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    console.error(`Error al obtener el libro ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error del servidor al obtener el libro' });
  }
};

module.exports = { getBooks, getBookById }; 