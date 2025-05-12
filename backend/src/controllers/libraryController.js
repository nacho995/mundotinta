const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { placeholderBooks } = require('../utils/placeholderData');

// Verificar token JWT
const verifyToken = (token) => {
  try {
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET || 'mundotinta-secret-key');
  } catch (error) {
    console.error('Error verificando token:', error.message);
    return null;
  }
};

// Obtener los libros del usuario
exports.getUserBooks = async (req, res) => {
  try {
    // Extraer el token de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado: Token no proporcionado' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    console.log('Token decodificado:', decoded);
    
    if (!decoded) {
      return res.status(401).json({ error: 'No autorizado: Token inválido' });
    }
    
    // En una aplicación real, buscaríamos en la base de datos
    // Pero por ahora, devolveremos datos simulados
    
    // Crear una selección aleatoria de libros para cada usuario
    // basada en su ID para que siempre vean los mismos libros
    const userId = decoded.id || decoded.userId || 'default-user';
    let userDigit = 0;
    
    // Convertir el userId en un número para selección consistente
    for (let i = 0; i < userId.length; i++) {
      userDigit += userId.charCodeAt(i);
    }
    
    // Seleccionar algunos libros basados en el "userDigit"
    const userBooks = [];
    const bookCount = (userDigit % 5) + 3; // Entre 3 y 7 libros
    
    const usedIndices = new Set();
    
    for (let i = 0; i < bookCount; i++) {
      let randomIndex;
      do {
        randomIndex = (userDigit + i * 17) % placeholderBooks.length;
      } while (usedIndices.has(randomIndex));
      
      usedIndices.add(randomIndex);
      const book = { ...placeholderBooks[randomIndex] };
      
      // Añadir datos específicos de la biblioteca del usuario
      book.addedOn = new Date(Date.now() - (i * 86400000)).toISOString(); // días atrás
      book.progress = Math.floor(Math.random() * 101); // 0-100%
      book.favorite = book.id % 3 === 0; // Algunos favoritos
      
      userBooks.push(book);
    }
    
    res.json({
      books: userBooks,
      count: userBooks.length
    });
  } catch (error) {
    console.error('Error al obtener libros del usuario:', error);
    res.status(500).json({ error: 'Error al obtener libros del usuario' });
  }
};

// Obtener favoritos del usuario
exports.getUserFavorites = async (req, res) => {
  try {
    // Extraer el token de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado: Token no proporcionado' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'No autorizado: Token inválido' });
    }
    
    // Obtener primero todos los libros del usuario
    const userId = decoded.id || decoded.userId || 'default-user';
    let userDigit = 0;
    
    for (let i = 0; i < userId.length; i++) {
      userDigit += userId.charCodeAt(i);
    }
    
    const bookCount = (userDigit % 5) + 3;
    const usedIndices = new Set();
    const userBooks = [];
    
    for (let i = 0; i < bookCount; i++) {
      let randomIndex;
      do {
        randomIndex = (userDigit + i * 17) % placeholderBooks.length;
      } while (usedIndices.has(randomIndex));
      
      usedIndices.add(randomIndex);
      const book = { ...placeholderBooks[randomIndex] };
      book.favorite = book.id % 3 === 0;
      
      userBooks.push(book);
    }
    
    // Filtrar solo favoritos
    const favorites = userBooks.filter(book => book.favorite);
    
    res.json({
      favorites,
      count: favorites.length
    });
  } catch (error) {
    console.error('Error al obtener favoritos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener favoritos del usuario' });
  }
};

// Obtener compras del usuario
exports.getPurchases = async (req, res) => {
  try {
    // Extraer el token de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado: Token no proporcionado' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    console.log('Token decodificado para compras:', decoded);
    
    if (!decoded) {
      return res.status(401).json({ error: 'No autorizado: Token inválido' });
    }
    
    // Simular compras basadas en el ID del usuario
    const userId = decoded.id || decoded.userId || 'default-user';
    let userDigit = 0;
    
    for (let i = 0; i < userId.length; i++) {
      userDigit += userId.charCodeAt(i);
    }
    
    // Compras simuladas (menos que libros en biblioteca)
    const purchaseCount = Math.min((userDigit % 3) + 2, placeholderBooks.length);
    const usedIndices = new Set();
    const purchases = [];
    
    // Generar compras simuladas
    for (let i = 0; i < purchaseCount; i++) {
      let randomIndex;
      do {
        randomIndex = (userDigit + i * 29) % placeholderBooks.length; // Diferente fórmula para variedad
      } while (usedIndices.has(randomIndex));
      
      usedIndices.add(randomIndex);
      const book = { ...placeholderBooks[randomIndex] };
      
      // Datos de la compra
      const purchaseDate = new Date(Date.now() - (i * 15 * 86400000)).toISOString(); // Compras en los últimos meses
      const purchaseTypes = ['physical', 'ebook', 'audiobook'];
      const purchaseType = purchaseTypes[i % purchaseTypes.length];
      
      purchases.push({
        id: `purchase-${userId}-${book.id}`,
        book: book,
        purchaseDate: purchaseDate,
        type: purchaseType,
        orderNumber: `ORD-${Math.floor(Math.random() * 100000)}`
      });
    }
    
    res.json({
      purchases: purchases,
      count: purchases.length
    });
  } catch (error) {
    console.error('Error al obtener compras del usuario:', error);
    res.status(500).json({ error: 'Error al obtener compras del usuario' });
  }
};
