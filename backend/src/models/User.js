const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio.'],
    unique: true,
    lowercase: true,
    trim: true,
    // Validación de email simple, se puede mejorar con una regex más compleja o validator.js
    match: [/^\S+@\S+\.\S+$/, 'Por favor, introduce un correo electrónico válido.'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria.'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres.'],
    select: false, // Para no enviar la contraseña por defecto en las consultas
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Middleware (hook) de Mongoose: Hashear contraseña antes de guardar
userSchema.pre('save', async function (next) {
  // Solo hashear la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12); // Aumentado a 12 por seguridad
  this.password = await bcrypt.hash(this.password, salt);

  // Si la contraseña cambia, eliminamos los tokens de reseteo por seguridad
  if (this.isModified('password') && this.passwordResetToken) {
      this.passwordResetToken = undefined;
      this.passwordResetExpires = undefined;
  }
  next();
});

// Método para comparar contraseñas (instancia del modelo)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para generar y hashear el token de reseteo de contraseña
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // El token expira en 10 minutos
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; // Devolvemos el token original (sin hashear) para enviarlo por email
};

const User = mongoose.model('User', userSchema);

module.exports = User; 