import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "A&D Parfum — Haute Parfumerie, Nicho & Decants de Autor",
  description:
    "Curaduría de alta perfumería árabe, creaciones de nicho y decants exclusivos en atomizadores de cristal. Descubre tu memoria olfativa con A&D Parfum en Colombia.",
  keywords: [
    "A&D Parfum",
    "AD Parfum",
    "Perfumes Árabes Colombia",
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
      "La más selecta curaduría de perfumes árabes, elixires de nicho y decants originales fraccionados en cristal. Envíos asegurados a toda Colombia.",
    url: "https://adparfum.com",
    siteName: "A&D Parfum",
    locale: "es_CO",
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
      <body className="min-h-screen flex flex-col bg-porcelain text-espresso selection:bg-espresso selection:text-champagne antialiased">
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
