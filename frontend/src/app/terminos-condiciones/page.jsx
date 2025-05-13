// Pagina de Terminos y Condiciones
export default function TerminosCondicionesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          Bienvenido a Mundo Tinta. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de Mundo Tinta, ubicado en www.mundo-tinta.com.
        </p>
        <p>
          Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones. No continúes usando Mundo Tinta si no estás de acuerdo con todos los términos y condiciones establecidos en esta página.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Cookies</h2>
        <p>
          El sitio web utiliza cookies para ayudar a personalizar tu experiencia en línea. Al acceder a Mundo Tinta, aceptaste utilizar las cookies necesarias.
        </p>
        <p>
          Una cookie es un archivo de texto que un servidor de páginas web coloca en tu disco duro. Las cookies no se pueden utilizar para ejecutar programas o enviar virus a tu computadora. Las cookies se te asignan de forma exclusiva y solo pueden ser leídas por un servidor web en el dominio que emitió la cookie.
        </p>
        <p>
          Podemos utilizar cookies para recopilar, almacenar y rastrear información con fines estadísticos o de marketing para operar nuestro sitio web. Tienes la capacidad de aceptar o rechazar cookies opcionales. Hay algunas cookies obligatorias que son necesarias para el funcionamiento de nuestro sitio web. Estas cookies no requieren tu consentimiento ya que siempre funcionan. Ten en cuenta que al aceptar las cookies obligatorias, también aceptas las cookies de terceros, que podrían usarse a través de servicios proporcionados por terceros si utilizas dichos servicios en nuestro sitio web, por ejemplo, una ventana de visualización de video proporcionada por terceros e integrada en nuestro sitio web.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Licencia</h2>
        <p>
          A menos que se indique lo contrario, Mundo Tinta y/o sus licenciantes poseen los derechos de propiedad intelectual de todo el material en Mundo Tinta. Todos los derechos de propiedad intelectual son reservados. Puedes acceder desde Mundo Tinta para tu uso personal sujeto a las restricciones establecidas en estos términos y condiciones.
        </p>
        <p>No debes:</p>
        <ul>
          <li>Copiar o volver a publicar material de Mundo Tinta</li>
          <li>Vender, alquilar o sublicenciar material de Mundo Tinta</li>
          <li>Reproducir, duplicar o copiar material de Mundo Tinta</li>
          <li>Redistribuir contenido de Mundo Tinta</li>
        </ul>
        <p>Este Acuerdo comenzará en la fecha presente.</p>

        {/* Añadir más secciones según sea necesario: Responsabilidad del contenido, Descargo de responsabilidad, Ley aplicable, etc. */}
        <p className="mt-6">
          Nos reservamos el derecho de solicitar que elimines todos los enlaces o cualquier enlace en particular a nuestro sitio web. Apruebas eliminar de inmediato todos los enlaces a nuestro sitio web cuando se solicite. También nos reservamos el derecho de modificar estos términos y condiciones y su política de vinculación en cualquier momento. Al vincular continuamente a nuestro sitio web, aceptas estar vinculado y seguir estos términos y condiciones de vinculación.
        </p>
        <p className="mt-6">
          <strong>Última actualización:</strong> 13 de Mayo de 2025
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Términos y Condiciones - Mundo Tinta',
  description: 'Consulta los términos y condiciones de uso de Mundo Tinta.',
}; 