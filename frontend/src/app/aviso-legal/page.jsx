// Pagina de Aviso Legal
export default function AvisoLegalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Aviso Legal</h1>
      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-6 mb-3">Identificación del Titular</h2>
        <p>Nombre del sitio web: Mundo Tinta</p>
        <p>Dominio: www.mundo-tinta.com</p>
        <p>Email de contacto: contacto@mundotinta.com</p>
        <p>Titular: Ignacio Dalesio Lopez (Autónomo)</p>
        <p>NIF: 06590436Q</p>
        <p>Domicilio: Calle Azulinas, Madrid, España</p>
        {/* Añade aquí más datos si son requeridos por tu legislación local (Nombre/Razón social, Domicilio, NIF/CIF, etc.) */}

        <h2 className="text-2xl font-semibold mt-6 mb-3">Propiedad Intelectual</h2>
        <p>
          Los contenidos de este sitio web, incluyendo textos, imágenes, diseño gráfico, código fuente, logos, marcas, etc., son titularidad exclusiva de Mundo Tinta o de terceros que han autorizado su uso, y están protegidos por la normativa sobre propiedad intelectual e industrial.
        </p>
        <p>
          Queda prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra actividad que se pueda realizar con los contenidos de esta página web, ni aun citando las fuentes, salvo consentimiento previo, expreso y por escrito de Mundo Tinta.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Tienda Online</h2>
        <p>
          Este sitio web utiliza Shopify como plataforma de comercio electrónico. Shopify proporciona la infraestructura tecnológica necesaria para gestionar nuestra tienda online y los procesos de compra.
        </p>
        <p>
          La información relacionada con el procesamiento de pagos es gestionada directamente por Shopify, ofreciendo un entorno seguro y cumpliendo con los estándares de seguridad requeridos para el comercio electrónico.
        </p>
        <p>
          Para más información sobre la política de privacidad de Shopify y sus términos de servicio, puedes consultar su sitio web oficial.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Exclusión de Responsabilidad</h2>
        <p>
          Mundo Tinta no se hace responsable de los perjuicios que se pudieran derivar de interferencias, omisiones, interrupciones, virus informáticos, averías telefónicas o desconexiones en el funcionamiento operativo de este sistema electrónico, motivadas por causas ajenas a Mundo Tinta; de retrasos o bloqueos en el uso del presente sistema electrónico causados por deficiencias o sobrecargas en su Centro de Procesos de Datos, de líneas telefónicas, en el sistema de Internet o en otros sistemas electrónicos; ni tampoco de daños que puedan ser causados por terceras personas mediante intromisiones ilegítimas fuera del control de Mundo Tinta.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Legislación Aplicable y Jurisdicción</h2>
        <p>
          Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de las actividades en él desarrolladas, será de aplicación la legislación española, a la que se someten expresamente las partes, siendo competentes para la resolución de todos los conflictos derivados o relacionados con su uso los Juzgados y Tribunales de Madrid, España.
        </p>

        <p className="mt-6">
          <strong>Última actualización:</strong> 13 de Mayo de 2025
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Aviso Legal - Mundo Tinta',
  description: 'Información legal y de afiliación de Mundo Tinta.',
}; 