require('dotenv').config(); // Carga variables de entorno desde .env
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Importar la función de conexión

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const bookRoutes = require('./routes/bookRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes'); // Añadida ruta para gestión de usuarios
const libraryRoutes = require('./routes/libraryRoutes'); // Añadida ruta para biblioteca de usuario

// Conectar a la base de datos
connectDB();

const app = express();
const PORT = process.env.PORT || 5001; // Puerto para el backend

// Middleware
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // URL de tu frontend
  credentials: true 
}));
app.use(express.json()); // Para parsear application/json
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded

// Rutas de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend de Mundo Tinta está funcionando!' });
});

// Usar las rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes); // Registrando las rutas de usuario
app.use('/api/library', libraryRoutes); // Registrando las rutas de biblioteca de usuario

// Manejador de errores básico (opcional, se puede mejorar)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor!');
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
}); 