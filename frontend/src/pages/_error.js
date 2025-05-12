import React from 'react';

function Error({ statusCode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-stone-950">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold mb-6 text-amber-300">
          {statusCode
            ? `Error ${statusCode}`
            : 'Se ha producido un error'}
        </h1>
        <p className="text-stone-300 mb-8">
          Lo sentimos, ha ocurrido un problema al cargar esta página.
        </p>
        <a
          href="/"
          className="px-6 py-2 bg-gradient-to-r from-[#A0522D] to-[#8B4513] text-white font-semibold rounded-md shadow-md"
        >
          Volver a la página principal
        </a>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
