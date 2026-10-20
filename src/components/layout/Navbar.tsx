"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const router = useRouter();
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/perfumes?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-porcelain/90 backdrop-blur-xl border-b border-sand shadow-sm"
            : "bg-porcelain/70 backdrop-blur-md border-b border-sand/40"
        }`}
      >
        <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between">
          
          {/* Left: Mobile Toggle & Desktop Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-espresso hover:bg-sand/40 rounded-full transition-colors"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-tight font-medium text-graphite">
              <Link
                href="/perfumes"
                className="hover:text-espresso transition-colors"
              >
                Catálogo
              </Link>
              <Link
                href="/perfumes?category=cat-arabes"
                className="hover:text-espresso transition-colors"
              >
                Perfumes Árabes
              </Link>
              <Link
                href="/perfumes?category=cat-decants"
                className="hover:text-espresso transition-colors flex items-center gap-1.5"
              >
                <span>Decants & Muestras</span>
                <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
              </Link>
              <Link
                href="/perfumes?category=cat-nicho"
                className="hover:text-espresso transition-colors"
              >
                Alta Gama & Nicho
              </Link>
              <Link
                href="/#descubrimiento"
                className="hover:text-espresso transition-colors"
              >
                Pirámide Olfativa
              </Link>
            </nav>
          </div>

          {/* Center: Official Brand Logo & Wordmark */}
          <div className="flex-1 lg:flex-initial text-center lg:text-left flex items-center justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group py-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-dark.png"
                alt="A&D Parfum"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Right: Search, Admin Shortcut, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-graphite hover:text-espresso hover:bg-sand/40 rounded-full transition-colors"
              aria-label="Buscar perfumes"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center text-[12px] font-medium text-taupe hover:text-espresso px-3 py-1.5 rounded-full hover:bg-sand/40 transition-colors"
              title="Panel Administrativo"
            >
              Admin
            </Link>

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-espresso hover:bg-sand/40 rounded-full transition-colors flex items-center gap-2"
              aria-label="Abrir bolsa de compras"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-espresso text-champagne text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-champagne/40 animate-in zoom-in-50">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-espresso/60 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative min-h-screen flex items-start justify-center pt-20 px-4">
            <div className="relative bg-porcelain w-full max-w-2xl rounded-cowboy border border-sand shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-sand">
                <span className="text-xs uppercase tracking-widest text-taupe font-medium">
                  Buscador de Fragancias A&D Parfum
                </span>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 text-graphite hover:text-espresso rounded-full hover:bg-sand/40"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-taupe absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por perfume, casa (Lattafa, Afnan, Rasasi) o notas..."
                    autoFocus
                    className="w-full pl-12 pr-4 py-3.5 bg-sand/30 border border-sand rounded-cowboy text-espresso placeholder-taupe text-sm focus:outline-none focus:border-espresso focus:bg-white transition-all"
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-graphite">
                  <span className="text-taupe">Sugerencias:</span>
                  {["Khamrah", "Hawas", "9 PM", "Club de Nuit", "Yara", "Decant 5ml"].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        router.push(`/perfumes?search=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="px-3 py-1 rounded-full bg-sand/40 hover:bg-sand text-espresso transition-colors font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button type="submit" className="btn-primary text-xs">
                    Buscar en Catálogo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-espresso/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-porcelain border-r border-sand flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-dark.png"
                  alt="A&D Parfum"
                  className="h-10 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-graphite hover:text-espresso rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="py-6 space-y-4">
                <Link
                  href="/perfumes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-espresso hover:text-champagne-dark transition-colors"
                >
                  Catálogo Completo
                </Link>
                <Link
                  href="/perfumes?category=cat-arabes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-espresso hover:text-champagne-dark transition-colors"
                >
                  Perfumes Árabes
                </Link>
                <Link
                  href="/perfumes?category=cat-decants"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-espresso hover:text-champagne-dark transition-colors flex items-center justify-between"
                >
                  <span>Decants & Muestras</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-espresso text-champagne px-2 py-0.5 rounded-full border border-champagne/30">
                    5ml & 10ml
                  </span>
                </Link>
                <Link
                  href="/perfumes?category=cat-nicho"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-espresso hover:text-champagne-dark transition-colors"
                >
                  Alta Gama & Nicho
                </Link>
                <Link
                  href="/#descubrimiento"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-espresso hover:text-champagne-dark transition-colors"
                >
                  Explorador Olfativo
                </Link>
                <Link
                  href="/#marcas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-espresso hover:text-champagne-dark transition-colors"
                >
                  Casas & Marcas
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-taupe hover:text-espresso transition-colors pt-4 border-t border-sand"
                >
                  Panel Administrativo
                </Link>
              </nav>
            </div>

            <div className="space-y-4 pt-6 border-t border-sand">
              <div className="flex items-center gap-2 text-xs text-taupe">
                <ShieldCheck className="w-4 h-4 text-champagne" />
                <span>Decants 100% auténticos en cristal</span>
              </div>
              <Link
                href="https://www.instagram.com/adparfum/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full text-xs justify-between"
              >
                <span>Seguir en Instagram</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
