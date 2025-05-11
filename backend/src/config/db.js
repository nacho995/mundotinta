const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('Error: La variable de entorno MONGO_URI no está definida.');
      console.log('Asegúrate de tener un archivo .env en la raíz de la carpeta /backend con MONGO_URI=tu_string_de_conexion_mongodb');
      process.exit(1); // Salir del proceso si no hay URI
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // No es necesario en Mongoose 6+
      // useFindAndModify: false, // No es necesario en Mongoose 6+
    });

    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar con MongoDB: ${error.message}`);
    process.exit(1); // Salir del proceso con fallo
  }
};

module.exports = connectDB; 