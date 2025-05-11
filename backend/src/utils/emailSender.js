const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('ADVERTENCIA: SENDGRID_API_KEY no está definida. El envío de correos no funcionará.');
  console.warn('Asegúrate de tener SENDGRID_API_KEY y SENDGRID_FROM_EMAIL en tu archivo .env');
}

/**
 * Envía un correo electrónico utilizando SendGrid.
 * @param {object} options Opciones del correo.
 * @param {string} options.to Destinatario del correo.
 * @param {string} options.subject Asunto del correo.
 * @param {string} options.text Contenido en texto plano del correo.
 * @param {string} [options.html] Contenido HTML del correo (opcional).
 */
const sendEmail = async (options) => {
  if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
    console.error('Error: Falta configuración de SendGrid (API Key o From Email).');
    console.log('---- Simulación de Envío de Email (Configuración de SendGrid Faltante) ----');
    console.log(`Para: ${options.to}`);
    console.log(`De: (No configurado) ${SENDGRID_FROM_EMAIL}`);
    console.log(`Asunto: ${options.subject}`);
    console.log(`Texto: ${options.text}`);
    if (options.html) console.log(`HTML: ${options.html}`);
    console.log('---------------------------------------------------------------------');
    // Podríamos arrojar un error aquí o simplemente no intentar enviar si no está configurado.
    // Por ahora, para desarrollo, evitamos que la app crashee y solo logueamos.
    return Promise.resolve(); // Simula éxito para no romper el flujo en desarrollo sin API Key
  }

  const msg = {
    to: options.to,
    from: SENDGRID_FROM_EMAIL, // DEBE ser un email verificado en tu cuenta de SendGrid
    subject: options.subject,
    text: options.text,
    html: options.html, // Opcional
  };

  try {
    await sgMail.send(msg);
    console.log(`Correo enviado a ${options.to} via SendGrid.`);
  } catch (error) {
    console.error('Error al enviar correo con SendGrid:', error);
    if (error.response) {
      console.error(error.response.body); // Errores específicos de la API de SendGrid
    }
    // No relanzar el error para que el flujo principal (ej. forgotPassword) no falle completamente
    // si el envío de email es el único problema.
    // Se podría implementar un sistema de reintentos o notificación de fallo más robusto.
  }
};

module.exports = sendEmail; 