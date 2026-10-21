"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, ArrowRight, Instagram } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (pathname === "/") {
        // If on homepage, dispatch search or go to anchor with search
        const elem = document.getElementById("inventario");
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
          window.dispatchEvent(new CustomEvent("adparfum:search", { detail: searchQuery.trim() }));
        } else {
          router.push(`/#inventario?search=${encodeURIComponent(searchQuery.trim())}`);
        }
      } else {
        router.push(`/#inventario?search=${encodeURIComponent(searchQuery.trim())}`);
      }
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handlePerfumesClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      const elem = document.getElementById("inventario");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-noir/95 backdrop-blur-md border-b border-white/10 shadow-xl py-3"
            : "bg-noir border-b border-white/10 py-3.5"
        }`}
      >
        <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between gap-2 sm:gap-4">
            
            {/* Left: Mobile Toggle & Desktop Editorial Navigation */}
            <div className="flex items-center justify-start gap-6">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 text-white hover:text-wine-light transition-colors"
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </button>

              <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[12px] uppercase tracking-[0.18em] font-medium text-white/75">
                <Link
                  href="/#inventario"
                  onClick={handlePerfumesClick}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group py-1"
                >
                  <span>Colección</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-wine opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                </Link>
                <Link
                  href="/perfumes"
                  className="hover:text-white transition-colors py-1 hover:border-b hover:border-wine/60"
                >
                  Catálogo
                </Link>
              </nav>
            </div>

            {/* Center: Official Brand Logo - Mathematically Centered */}
            <div className="flex items-center justify-center">
              <Link href="/" className="inline-block transition-transform duration-300 hover:scale-[1.03]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-light.png"
                  alt="A&D Parfum"
                  className="h-9 sm:h-11 w-auto object-contain filter drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]"
                />
              </Link>
            </div>

            {/* Right: Integrated Desktop Search, Concierge, Admin & Shopping Bag */}
            <div className="flex items-center justify-end gap-2.5 sm:gap-3.5">
              {/* Desktop Inline Search Bar (Fixed Width - No Jump/Shift) */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative hidden md:flex items-center group"
              >
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 pointer-events-none group-focus-within:text-white/80 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar perfume o nota..."
                  className="w-40 lg:w-48 xl:w-56 bg-white/[0.07] hover:bg-white/[0.11] focus:bg-white/[0.14] border border-white/10 focus:border-wine/70 rounded-full py-1.5 pl-8 pr-7 text-xs text-white placeholder:text-white/40 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 text-white/40 hover:text-white p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </form>

              {/* Mobile Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                aria-label="Buscar fragancias"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* WhatsApp VIP Concierge Pill (Desktop) */}
              <a
                href="https://wa.me/18293751717?text=Hola%20A%26D%20Parfum,%20deseo%20asesor%C3%ADa%20personalizada%20sobre%20una%20fragancia"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[11px] text-white/80 hover:text-white transition-all shadow-xs flex-shrink-0"
                title="Atención directa por WhatsApp en República Dominicana"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="tracking-wide">Asesoría RD</span>
              </a>

              {/* Admin Link */}
              <Link
                href="/admin"
                className="hidden lg:inline-flex text-[10px] uppercase tracking-luxury font-semibold text-white/40 hover:text-white px-2 py-1 rounded transition-colors flex-shrink-0"
              >
                Admin
              </Link>

              {/* Shopping Bag Boutique Button */}
              <button
                onClick={openCart}
                className="relative py-2 px-3.5 sm:px-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 hover:border-wine/60 text-white transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-sm active:scale-95 group flex-shrink-0"
                aria-label="Bolsa de compra"
              >
                <ShoppingBag className="w-4 h-4 text-wine-light transition-transform group-hover:scale-105" />
                <span className="hidden sm:inline tracking-wide">Bolsa</span>
                <span className="font-price bg-wine text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Functional Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-noir/75 backdrop-blur-sm transition-opacity"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative min-h-screen flex items-start justify-center pt-20 px-4">
            <div className="relative bg-white w-full max-w-xl rounded-cowboy border border-border shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-xs uppercase tracking-luxury text-gray font-semibold">
                  Buscar en el inventario A&D Parfum
                </span>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 text-gray hover:text-noir rounded-full hover:bg-ivory"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Escribe el nombre, casa (Lattafa, Afnan, Rasasi) o nota..."
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 bg-ivory border border-border rounded-cowboy text-noir placeholder-gray text-sm focus:outline-none focus:border-wine focus:bg-white transition-all"
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray">
                  <span>Populares:</span>
                  {["Khamrah", "Hawas", "9 PM", "Club de Nuit", "Yara", "Decant 5ml"].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        if (pathname === "/") {
                          const elem = document.getElementById("inventario");
                          if (elem) {
                            elem.scrollIntoView({ behavior: "smooth" });
                            window.dispatchEvent(new CustomEvent("adparfum:search", { detail: term }));
                          }
                        } else {
                          router.push(`/#inventario?search=${encodeURIComponent(term)}`);
                        }
                        setSearchOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-full bg-ivory hover:bg-border text-noir transition-colors font-medium text-[11px]"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button type="submit" className="btn-wine text-xs py-2 px-5">
                    Buscar Fragancia
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-noir/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-noir text-white border-r border-white/10 flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-light.png"
                  alt="A&D Parfum"
                  className="h-9 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-white/70 hover:text-white rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="py-6 space-y-4">
                <Link
                  href="/#inventario"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handlePerfumesClick(e);
                  }}
                  className="block text-base font-medium text-white hover:text-wine-light transition-colors"
                >
                  Perfumes &amp; Decants
                </Link>
                <Link
                  href="/perfumes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-white/80 hover:text-white transition-colors"
                >
                  Catálogo Completo
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-white/60 hover:text-white transition-colors pt-4 border-t border-white/10"
                >
                  Panel Administrativo
                </Link>
              </nav>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <Link
                href="https://www.instagram.com/eidiparfum/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full py-2.5 px-4 rounded-cowboy bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-wine-light" />
                  <span>@eidiparfum en Instagram</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/50" />
              </Link>
              <p className="text-[11px] text-white/50 text-center">
                República Dominicana • Envíos a todo el país
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
