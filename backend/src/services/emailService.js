const nodemailer = require('nodemailer');

// Configuración del transporte de correo
const createTransporter = () => {
  // Para desarrollo, usamos Ethereal (servicio de prueba de Nodemailer)
  // En producción, esto usaría credenciales reales de un servicio SMTP
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
      pass: process.env.EMAIL_PASS || 'ethereal_pass'
    }
  });
};

// Plantilla HTML base para los correos electrónicos
const getBaseTemplate = () => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mundo-tinta</title>
  <style>
    /* Estilos generales */
    body {
      margin: 0;
      padding: 0;
      font-family: 'Merriweather', 'Georgia', serif;
      background-color: #1c1917;
      color: #e7e5e4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #292524;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background: linear-gradient(to right, rgba(146, 64, 14, 0.9), rgba(41, 37, 36, 0.9));
    }
    .header img {
      max-width: 180px;
      height: auto;
    }
    .content {
      padding: 30px 40px;
      line-height: 1.6;
    }
    h1 {
      color: #d6a656;
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: normal;
    }
    p {
      margin-bottom: 20px;
      color: #e7e5e4;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(to right, #b45309, #92400e);
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .button:hover {
      background: linear-gradient(to right, #92400e, #78350f);
    }
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #1c1917;
      color: #a8a29e;
      font-size: 12px;
    }
    .divider {
      border-top: 1px solid #a8a29e33;
      margin: 20px 0;
    }
    .highlight {
      color: #d6a656;
      font-weight: bold;
    }
    .signature {
      font-style: italic;
      color: #d6a656;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://mundotinta.com/logo.png" alt="Mundo-tinta Logo" onerror="this.src='https://placehold.co/180x60/92400e/FFFFFF?text=Mundo-tinta'">
    </div>
    <div class="content">
      {{CONTENT}}
    </div>
    <div class="footer">
      <p>Mundo-tinta | Tu librería online de confianza</p>
      <p>© ${new Date().getFullYear()} Mundo-tinta. Todos los derechos reservados.</p>
      <p>Este correo fue enviado porque te has registrado en nuestro sitio. Si no has sido tú, puedes ignorar este mensaje.</p>
    </div>
  </div>
</body>
</html>
`;

// Plantilla para confirmación de registro
const getRegisterTemplate = (user, verificationLink) => {
  const content = `
    <h1>¡Bienvenido a Mundo-tinta, ${user.name}!</h1>
    <p>Gracias por registrarte en nuestra comunidad de lectores. Estamos encantados de tenerte con nosotros.</p>
    <p>Para completar tu registro y comenzar a disfrutar de nuestro catálogo, por favor confirma tu correo electrónico:</p>
    <p style="text-align: center;">
      <a href="${verificationLink}" class="button">Confirmar mi correo</a>
    </p>
    <p>Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:</p>
    <p style="font-size: 12px; word-break: break-all;">${verificationLink}</p>
    <div class="divider"></div>
    <p>¿Necesitas ayuda? No dudes en contactarnos a través de nuestra sección de <a href="https://mundotinta.com/contacto" style="color: #d6a656;">contacto</a>.</p>
    <p class="signature">El equipo de Mundo-tinta</p>
  `;
  return getBaseTemplate().replace('{{CONTENT}}', content);
};

// Plantilla para recuperación de contraseña
const getPasswordResetTemplate = (user, resetLink) => {
  const content = `
    <h1>Recuperación de contraseña</h1>
    <p>Hola ${user.name},</p>
    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Mundo-tinta.</p>
    <p>Si no has solicitado este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.</p>
    <p>Para restablecer tu contraseña, haz clic en el siguiente botón:</p>
    <p style="text-align: center;">
      <a href="${resetLink}" class="button">Restablecer contraseña</a>
    </p>
    <p>Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:</p>
    <p style="font-size: 12px; word-break: break-all;">${resetLink}</p>
    <p>Este enlace expirará en 30 minutos por motivos de seguridad.</p>
    <div class="divider"></div>
    <p>¿Necesitas ayuda? No dudes en contactarnos a través de nuestra sección de <a href="https://mundotinta.com/contacto" style="color: #d6a656;">contacto</a>.</p>
    <p class="signature">El equipo de Mundo-tinta</p>
  `;
  return getBaseTemplate().replace('{{CONTENT}}', content);
};

// Plantilla para confirmación de contacto
const getContactFormTemplate = (formData) => {
  const content = `
    <h1>Hemos recibido tu mensaje</h1>
    <p>Hola ${formData.name},</p>
    <p>Gracias por ponerte en contacto con nosotros. Hemos recibido tu mensaje y queremos confirmarte que lo estamos revisando.</p>
    <p>Estos son los datos que nos has proporcionado:</p>
    <div style="background-color: #1c1917; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <p><span class="highlight">Nombre:</span> ${formData.name}</p>
      <p><span class="highlight">Email:</span> ${formData.email}</p>
      <p><span class="highlight">Asunto:</span> ${formData.subject}</p>
      <p><span class="highlight">Mensaje:</span><br>${formData.message}</p>
    </div>
    <p>Te responderemos lo antes posible, normalmente en un plazo de 24-48 horas laborables.</p>
    <div class="divider"></div>
    <p>Mientras tanto, te invitamos a explorar nuestro catálogo de libros en <a href="https://mundotinta.com/catalogo" style="color: #d6a656;">mundotinta.com</a>.</p>
    <p class="signature">El equipo de Mundo-tinta</p>
  `;
  return getBaseTemplate().replace('{{CONTENT}}', content);
};

// Plantilla para confirmación de compra
const getPurchaseConfirmationTemplate = (user, orderDetails) => {
  // Generar filas de productos
  let productsHTML = '';
  let total = 0;
  
  orderDetails.items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    productsHTML += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #a8a29e33;">
          <img src="${item.image}" alt="${item.title}" style="width: 60px; height: auto;" onerror="this.src='https://placehold.co/60x80/92400e/FFFFFF?text=Libro'">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #a8a29e33;">${item.title}</td>
        <td style="padding: 10px; text-align: center; border-bottom: 1px solid #a8a29e33;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #a8a29e33;">${item.price.toFixed(2)}€</td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #a8a29e33;">${itemTotal.toFixed(2)}€</td>
      </tr>
    `;
  });

  const content = `
    <h1>¡Gracias por tu compra!</h1>
    <p>Hola ${user.name},</p>
    <p>Tu pedido ha sido confirmado y está siendo procesado. A continuación encontrarás los detalles de tu compra:</p>
    
    <div style="background-color: #1c1917; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <p><span class="highlight">Número de pedido:</span> ${orderDetails.orderNumber}</p>
      <p><span class="highlight">Fecha:</span> ${new Date(orderDetails.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    
    <h2 style="color: #d6a656; font-size: 18px; margin-top: 30px;">Resumen del pedido</h2>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; color: #e7e5e4;">
      <thead>
        <tr style="background-color: #1c1917;">
          <th style="padding: 10px; text-align: left;">Imagen</th>
          <th style="padding: 10px; text-align: left;">Título</th>
          <th style="padding: 10px; text-align: center;">Cantidad</th>
          <th style="padding: 10px; text-align: right;">Precio</th>
          <th style="padding: 10px; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${productsHTML}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" style="padding: 10px; text-align: right; border-top: 2px solid #a8a29e33;"><strong>Total:</strong></td>
          <td style="padding: 10px; text-align: right; border-top: 2px solid #a8a29e33;"><strong>${total.toFixed(2)}€</strong></td>
        </tr>
      </tfoot>
    </table>
    
    <div class="divider"></div>
    
    <p>Si tienes alguna pregunta sobre tu pedido, puedes revisar el estado en <a href="https://mundotinta.com/mi-cuenta/pedidos" style="color: #d6a656;">tu cuenta</a> o contactarnos a través de nuestra sección de <a href="https://mundotinta.com/contacto" style="color: #d6a656;">contacto</a>.</p>
    
    <p class="signature">El equipo de Mundo-tinta</p>
  `;
  return getBaseTemplate().replace('{{CONTENT}}', content);
};

// Función para enviar correo de confirmación de registro
const sendRegistrationEmail = async (user, verificationLink) => {
  try {
    const transporter = createTransporter();
    const htmlContent = getRegisterTemplate(user, verificationLink);
    
    const info = await transporter.sendMail({
      from: `"Mundo-tinta" <${process.env.EMAIL_FROM || 'noreply@mundotinta.com'}>`,
      to: user.email,
      subject: '¡Bienvenido a Mundo-tinta! Confirma tu cuenta',
      html: htmlContent
    });
    
    console.log('Correo de registro enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo de registro:', error);
    return { success: false, error: error.message };
  }
};

// Función para enviar correo de recuperación de contraseña
const sendPasswordResetEmail = async (user, resetLink) => {
  try {
    const transporter = createTransporter();
    const htmlContent = getPasswordResetTemplate(user, resetLink);
    
    const info = await transporter.sendMail({
      from: `"Mundo-tinta" <${process.env.EMAIL_FROM || 'noreply@mundotinta.com'}>`,
      to: user.email,
      subject: 'Recuperación de contraseña en Mundo-tinta',
      html: htmlContent
    });
    
    console.log('Correo de recuperación de contraseña enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo de recuperación de contraseña:', error);
    return { success: false, error: error.message };
  }
};

// Función para enviar confirmación de formulario de contacto
const sendContactConfirmationEmail = async (formData) => {
  try {
    const transporter = createTransporter();
    const htmlContent = getContactFormTemplate(formData);
    
    const info = await transporter.sendMail({
      from: `"Mundo-tinta" <${process.env.EMAIL_FROM || 'noreply@mundotinta.com'}>`,
      to: formData.email,
      subject: 'Hemos recibido tu mensaje | Mundo-tinta',
      html: htmlContent
    });
    
    console.log('Correo de confirmación de contacto enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo de confirmación de contacto:', error);
    return { success: false, error: error.message };
  }
};

// Función para enviar confirmación de compra
const sendPurchaseConfirmationEmail = async (user, orderDetails) => {
  try {
    const transporter = createTransporter();
    const htmlContent = getPurchaseConfirmationTemplate(user, orderDetails);
    
    const info = await transporter.sendMail({
      from: `"Mundo-tinta" <${process.env.EMAIL_FROM || 'noreply@mundotinta.com'}>`,
      to: user.email,
      subject: `Confirmación de pedido #${orderDetails.orderNumber} | Mundo-tinta`,
      html: htmlContent
    });
    
    console.log('Correo de confirmación de compra enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo de confirmación de compra:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendRegistrationEmail,
  sendPasswordResetEmail,
  sendContactConfirmationEmail,
  sendPurchaseConfirmationEmail
};
