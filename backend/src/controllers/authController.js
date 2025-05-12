const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Modelo de Mongoose
const emailService = require('../services/emailService');

// Secret key para JWT - Idealmente usar variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'mundotinta-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Función para generar un token JWT con más información del usuario
const generateToken = (user) => {
  // Incluir información adicional en el token para reducir consultas a la base de datos
  return jwt.sign({ 
    id: user._id, 
    name: user.name,
    email: user.email,
    role: user.role || 'user'
  }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }
  // Las validaciones de required, minlength, formato de email, etc., 
  // ahora las manejará Mongoose gracias a la definición del esquema.

  try {
    // Mongoose maneja la unicidad del email con `unique: true` en el esquema.
    // Si se intenta crear un usuario con un email existente, Mongoose arrojará un error (E11000).
    
    // Generar un token de verificación de email
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
    
    const newUser = await User.create({
      name,
      email,
      password,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      isEmailVerified: false
    });

    // El pre-hook de 'save' en el modelo User ya hashea la contraseña.
    // El campo 'password' se omite por defecto en las respuestas gracias a `select: false`.

    // Devolvemos el usuario sin la contraseña (Mongoose lo hace por defecto con select:false)
    // Para ser explícitos o si no se usara select:false:
    const userResponse = newUser.toObject();
    delete userResponse.password; // Aunque select:false ya lo haría
    delete userResponse.__v; // Opcional: quitar el campo de versión de Mongoose
    delete userResponse.emailVerificationToken;
    delete userResponse.emailVerificationExpires;
    
    // Generar token con el objeto usuario completo
    const token = generateToken(newUser);
    
    // Crear enlace de verificación
    const verificationLink = `${FRONTEND_URL}/verificar-email?token=${verificationToken}`;
    
    // Enviar email de confirmación de registro
    const emailResult = await emailService.sendRegistrationEmail(
      newUser,
      verificationLink
    );
    
    // El envío del correo es asincrónico y no bloqueante para la respuesta al usuario
    if (!emailResult.success) {
      console.error('No se pudo enviar el correo de verificación:', emailResult.error);
    }

    res.status(201).json({
      message: 'Usuario registrado con éxito. Por favor, verifica tu correo electrónico.',
      token,
      user: userResponse,
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Error en registro:', error);
    if (error.code === 11000) { // Error de duplicado de MongoDB (email ya existe)
        return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }
    if (error.name === 'ValidationError') { // Errores de validación de Mongoose
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};

// Iniciar sesión
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, proporciona email y contraseña.' });
  }

  try {
    // Seleccionar explícitamente la contraseña ya que está con `select: false`
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' }); // Mensaje genérico
    }

    // Usar el método de instancia del modelo para comparar contraseñas
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' }); // Mensaje genérico
    }
    
    // Generar token con el objeto usuario completo
    const token = generateToken(user);
    
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.__v;

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: userResponse,
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

// Verificar email
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).json({ message: 'Token no proporcionado' });
  }
  
  try {
    // Buscar usuario por token de verificación
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        message: 'El token de verificación es inválido o ha expirado' 
      });
    }
    
    // Actualizar usuario
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    return res.status(200).json({
      message: 'Email verificado con éxito. Ya puedes iniciar sesión.'
    });
  } catch (error) {
    console.error('Error al verificar email:', error);
    return res.status(500).json({ message: 'Error al verificar email' });
  }
};

// Solicitar recuperación de contraseña
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Por favor, proporciona tu email' });
  }
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      // Por seguridad, siempre respondemos lo mismo incluso si el usuario no existe
      return res.status(200).json({
        message: 'Si tu email está registrado, recibirás un correo con instrucciones para restablecer tu contraseña'
      });
    }
    
    // Generar token de restablecimiento y su fecha de expiración
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutos
    
    await user.save({ validateBeforeSave: false });
    
    // Crear enlace de restablecimiento de contraseña
    const resetLink = `${FRONTEND_URL}/restablecer-contrasena?token=${resetToken}`;
    
    // Enviar email
    const emailResult = await emailService.sendPasswordResetEmail(user, resetLink);
    
    if (!emailResult.success) {
      // Si falla el envío, revertimos los cambios
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      console.error('Error al enviar email de recuperación:', emailResult.error);
      return res.status(500).json({ 
        message: 'No se pudo enviar el email de recuperación. Por favor, inténtalo de nuevo más tarde.' 
      });
    }
    
    res.status(200).json({
      message: 'Si tu email está registrado, recibirás un correo con instrucciones para restablecer tu contraseña'
    });
  } catch (error) {
    console.error('Error en recuperación de contraseña:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
};

// Restablecer contraseña
exports.resetPassword = async (req, res) => {
  const { token } = req.query;
  const { password, confirmPassword } = req.body;
  
  if (!token) {
    return res.status(400).json({ message: 'Token no proporcionado' });
  }
  
  if (!password || !confirmPassword) {
    return res.status(400).json({ message: 'Por favor, proporciona ambas contraseñas' });
  }
  
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }
  
  try {
    // Hashear el token proporcionado para compararlo con el de la base de datos
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Buscar usuario por token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        message: 'El token es inválido o ha expirado. Por favor, solicita un nuevo enlace.' 
      });
    }
    
    // Actualizar contraseña
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    // Login automático (opcional)
    const loginToken = generateToken(user);
    
    res.status(200).json({
      message: 'Contraseña actualizada con éxito',
      token: loginToken
    });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
};

// Olvidó su contraseña
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Por favor, proporciona tu correo electrónico.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // No revelar si el usuario existe o no por seguridad
      return res.status(200).json({ message: 'Si tu correo está registrado, recibirás un enlace para reestablecer tu contraseña.' });
    }

    // Generar y guardar el token de reseteo (el método en el modelo User.js lo hace)
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // Guardar el token y la fecha de expiración, sin validar otros campos

    // Simulación de envío de correo
    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    const emailMessage = `Has solicitado reestablecer tu contraseña para Mundo Tinta. Por favor, haz clic en el siguiente enlace o cópialo en tu navegador para completar el proceso:\\n\\n${resetURL}\\n\\nSi no solicitaste este cambio, puedes ignorar este correo.\\nEste enlace expirará en 10 minutos.`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Reestablece tu contraseña de Mundo Tinta',
        text: emailMessage,
        // html: `<p>Puedes usar HTML aquí si lo deseas.</p>`
      });
      res.status(200).json({ message: 'Se ha enviado un enlace para reestablecer tu contraseña a tu correo electrónico.' });
    } catch (emailError) {
      // El error ya se loguea en sendEmail. Aquí decidimos si el flujo principal debe fallar.
      // Por ahora, informamos al usuario que el proceso de solicitud fue ok, pero el email podría no haber llegado.
      console.error('forgotPassword: El email de reseteo pudo no haberse enviado por error en sendEmail.', emailError);
      user.passwordResetToken = undefined; // Limpiar token si el email falla catastróficamente
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      // Podrías devolver un error 500, o un mensaje indicando que la solicitud se procesó pero el envío de email falló.
      return res.status(500).json({ message: 'Se procesó tu solicitud, pero hubo un problema al enviar el correo de reseteo. Intenta de nuevo más tarde o contacta a soporte.' });
    }

  } catch (error) {
    console.error('Error general en forgotPassword:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud de reseteo.' });
  }
};

// Resetear contraseña
exports.resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({ message: 'Por favor, proporciona la nueva contraseña y su confirmación.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }
  // La validación de longitud de contraseña la hará Mongoose al intentar guardar.

  try {
    // Hashear el token que viene del usuario para compararlo con el de la DB
    const hashedToken = require('crypto').createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Token no ha expirado
    }).select('+password'); // Necesitamos la contraseña para que el pre-save hook funcione si se modifica

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o ha expirado.' });
    }

    user.password = password; // El pre-save hook se encargará de hashearla
    user.passwordResetToken = undefined; // Limpiar token
    user.passwordResetExpires = undefined; // Limpiar fecha de expiración
    await user.save(); // Esto activará el pre-save hook para hashear la nueva contraseña

    // Generar un nuevo token JWT y loguear al usuario
    const token = generateToken(user._id);
    
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.__v;
    delete userResponse.passwordResetToken; 
    delete userResponse.passwordResetExpires;

    res.status(200).json({
        message: 'Contraseña reestablecida con éxito.',
        token,
        user: userResponse
    });

  } catch (error) {
    console.error('Error en resetPassword:', error);
     if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'Error al reestablecer la contraseña.' });
  }
};

// (Opcional) Obtener datos del usuario actualmente logueado
// exports.getMe = async (req, res) => {
//   // req.user es añadido por el middleware de protección
//   const user = await User.findById(req.user.id).select('-password'); 
//   res.status(200).json({ user });
// }; 