const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verifyToken = (token) => {
  try {
    if (!token) return null;
    // Usar secret key desde variables de entorno o default
    return jwt.verify(token, process.env.JWT_SECRET || 'mundotinta-secret-key');
  } catch (error) {
    console.error('Error verificando token:', error.message);
    return null;
  }
};

// Obtener perfil del usuario
exports.getUserProfile = async (req, res) => {
  try {
    // Extraer el token de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado: Token no proporcionado' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    console.log('Token decodificado:', decoded); // Log para debug
    
    if (!decoded) {
      return res.status(401).json({ error: 'No autorizado: Token inválido' });
    }
    
    // Comprobar diferentes estructuras posibles de token
    const userId = decoded.userId || decoded.id || decoded.sub || 'user-123';
    
    // Como ejemplo, devolvemos un perfil básico basado en la información del token
    // En un caso real buscarías el usuario en la base de datos
    // const user = await User.findById(userId);
    
    // Recuperar el correo electrónico del token o los headers
    const email = decoded.email || req.headers['x-user-email'] || 'usuario@mundotinta.com';
    
    // Buscar usuario en la base de datos si es posible
    try {
      // Si el modelo User está disponible, buscar el usuario real
      if (User) {
        const dbUser = await User.findOne({ email: email });
        if (dbUser) {
          console.log('Usuario encontrado en la base de datos:', dbUser.name);
          // Devolver datos reales del usuario
          return res.json({
            name: dbUser.name || 'Usuario',
            email: dbUser.email,
            booksCount: 10, // Ejemplo de datos estadísticos
            favoritesCount: 5,
            registeredOn: dbUser.createdAt || new Date().toISOString()
          });
        }
      }
    } catch (findError) {
      console.log('Error buscando usuario en la base de datos:', findError.message);
      // Continuar con la respuesta predeterminada si hay error
    }
    
    // Si no encontramos el usuario, usamos valores predeterminados enriquecidos
    // Obtener el nombre de usuario de localStorage en el frontend
    const userProfile = {
      name: decoded.name || decoded.username || 'Usuario de Mundo-tinta',
      email: email,
      booksCount: 12,
      favoritesCount: 7,
      registeredOn: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días atrás
    };
    
    console.log('Enviando perfil:', userProfile); // Log para debug
    
    res.json(userProfile);
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    
    // Respuesta de error detallada para ayudar a diagnosticar el problema
    res.status(500).json({
      error: 'Error al obtener perfil de usuario',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
