// Este archivo es necesario para la configuración básica del Pages Router en Next.js
// aunque estés usando principalmente el App Router
import { CartProvider } from '../context/CartContext';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp;
