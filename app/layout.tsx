
import Footer from "./components/Footer";
import Header from "./components/Header";
import { CartProvider } from "./components/CartProvider";
import FloatingCart from "./components/FloatingCart";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <CartProvider>
          <Header />
          <main >
            {children}  
          </main>
          <Footer />
          <FloatingCart />
        </CartProvider>

      </body>
    </html>
  );
}
