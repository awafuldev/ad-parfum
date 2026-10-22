import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "A&D Parfum — Haute Parfumerie, Nicho & Decants de Autor",
  description:
    "Curaduría de alta perfumería árabe, creaciones de nicho y decants exclusivos en atomizadores de cristal. Descubre tu memoria olfativa con A&D Parfum en República Dominicana.",
  keywords: [
    "A&D Parfum",
    "AD Parfum",
    "Perfumes Árabes República Dominicana",
    "Decants de Lujo",
    "Lattafa Khamrah",
    "Rasasi Hawas",
    "Afnan 9 PM",
    "Club de Nuit Intense",
    "Muestras de perfume 5ml 10ml",
  ],
  authors: [{ name: "A&D Parfum" }],
  openGraph: {
    title: "A&D Parfum — Haute Parfumerie & Decants de Autor",
    description:
      "La más selecta curaduría de perfumes árabes, elixires de nicho y decants originales fraccionados en cristal. Envíos en República Dominicana.",
    url: "https://adparfum.com",
    siteName: "A&D Parfum",
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
