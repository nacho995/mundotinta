const jwt = require('jsonwebtoken');

// Middleware para proteger rutas - verifica el token JWT
const protect = (req, res, next) => {
  let token;

  // Verificar si existe el token en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraer el token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mundotinta-secret-key');

      // Añadir el usuario decodificado a la solicitud
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error('Error de autenticación:', error);
      res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no se proporcionó token' });
  }
};

module.exports = { protect };
