// const nodemailer = require('nodemailer'); // Se usará más adelante para enviar correos reales
const sendEmail = require('../utils/emailSender'); // Importar el emailSender

// Simulación del controlador del formulario de contacto
exports.handleContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;
  const receiverEmail = process.env.CONTACT_FORM_RECEIVER_EMAIL;

  // Validación básica (se puede expandir con 'validator')
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  if (!receiverEmail) {
    console.error('Error Crítico: CONTACT_FORM_RECEIVER_EMAIL no está definido en .env. No se puede enviar el correo de contacto.');
    // Aún así, logueamos la información para no perderla, pero informamos de un error grave.
    console.log('---- Nuevo Mensaje de Contacto (NO ENVIADO POR FALTA DE CONFIGURACIÓN) ----');
    console.log('Nombre:', name);
    console.log('Email del remitente:', email);
    console.log('Asunto:', subject);
    console.log('Mensaje:', message);
    console.log('-------------------------------------------------------------------------');
    return res.status(500).json({ message: 'Error interno del servidor al procesar el formulario de contacto. Por favor, contacta al administrador.' });
  }

  const emailSubject = `Nuevo Mensaje de Contacto de Mundo Tinta: ${subject}`;
  const emailText = `Has recibido un nuevo mensaje de contacto a través de la web Mundo Tinta:\n\nNombre: ${name}\nEmail del remitente: ${email}\nAsunto: ${subject}\nMensaje:\n${message}\n\n-----------------------------------\nEste es un mensaje automático.`;
  const emailHtml = `
    <html>
      <body style="font-family: sans-serif; line-height: 1.6;">
        <h2>Nuevo Mensaje de Contacto de Mundo Tinta</h2>
        <p>Has recibido un nuevo mensaje de contacto a través de la web Mundo Tinta:</p>
        <hr>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email del remitente:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong></p>
        <p style="white-space: pre-wrap; background-color: #f8f9fa; padding: 10px; border-radius: 5px;">${message}</p>
        <hr>
        <p style="font-size: 0.9em; color: #6c757d;">Este es un mensaje automático.</p>
      </body>
    </html>
  `;

  try {
    await sendEmail({
      to: receiverEmail, // El email a donde llegarán los mensajes de contacto
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      // Opcional: si quieres que el campo "reply-to" del email sea el del usuario que contacta
      // Esto requiere que tu `sendEmail` y SendGrid lo soporten/configuren adecuadamente.
      // replyTo: email 
    });

    // Loguear también en consola del backend por si acaso
    console.log('---- Nuevo Mensaje de Contacto Procesado ----');
    console.log('Destinatario (Admin):', receiverEmail);
    console.log('Nombre remitente:', name);
    console.log('Email remitente:', email);
    console.log('Asunto:', subject);
    console.log('Mensaje:', message);
    console.log('-----------------------------------------');

    res.status(200).json({ message: 'Mensaje enviado con éxito. Gracias por contactarnos.' });
  } catch (error) {
    console.error('Error al procesar y enviar el formulario de contacto:', error);
    // Incluso si sendEmail maneja su propio error, aquí podríamos loguear el contexto del contactForm
    res.status(500).json({ message: 'Error al procesar tu mensaje. Inténtalo de nuevo más tarde.' });
  }
}; 