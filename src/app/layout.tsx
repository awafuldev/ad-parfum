import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Fragance Stock RD — Perfumes 100% Originales & Decants en República Dominicana",
  description:
    "Perfumería exclusiva en República Dominicana. Fragancias 100% originales para hombres y mujeres, decants en cristal y botellas selladas con delivery en Santo Domingo y envíos a todo el país.",
  keywords: [
    "Fragance Stock RD",
    "Fragance Stock",
    "Perfumes República Dominicana",
    "Perfumes Santo Domingo",
    "Perfumes Árabes RD",
    "Decants de Perfumes",
    "Lattafa Khamrah",
    "Rasasi Hawas",
    "Afnan 9 PM",
    "Club de Nuit Intense",
  ],
  authors: [{ name: "Fragance Stock RD" }],
  openGraph: {
    title: "Fragance Stock RD — Perfumes 100% Originales & Decants",
    description:
      "Fragancias 100% originales para hombres y mujeres. Decants en cristal y botellas completas. Delivery en Santo Domingo y envíos a toda República Dominicana.",
    url: "https://fragancestockrd.com",
    siteName: "Fragance Stock RD",
    locale: "es_DO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory text-noir antialiased selection:bg-wine selection:text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
