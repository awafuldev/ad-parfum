import React from "react";
import Link from "next/link";
import { Instagram, ArrowUpRight, ShieldCheck, Truck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-noir text-white py-12 border-t border-white/10">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-10 border-b border-white/10 text-center md:text-left">
          
          {/* Brand Info & Logo */}
          <div className="space-y-3 max-w-sm">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-light.png"
                alt="A&D Parfum"
                className="h-9 w-auto object-contain mx-auto md:mx-0"
              />
            </Link>
            <p className="text-xs text-white/70 font-light leading-relaxed">
              Curaduría de alta perfumería árabe, creaciones de autor y decants exclusivos fraccionados en atomizador de cristal. República Dominicana.
            </p>
          </div>

          {/* Quick Links & Service */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 sm:gap-10 text-xs text-white/80">
            <Link href="/#inventario" className="hover:text-white transition-colors">
              Explorar Perfumes
            </Link>
            <Link href="/perfumes" className="hover:text-white transition-colors">
              Catálogo Completo
            </Link>
            <Link
              href="https://www.instagram.com/eidiparfum/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-wine-light" />
              <span>@eidiparfum</span>
            </Link>
            <Link
              href="/admin"
              className="hover:text-white transition-colors flex items-center gap-1 text-white/50 hover:text-white"
            >
              <span>Admin</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Guarantees */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50">
          <p>© {new Date().getFullYear()} A&amp;D Parfum. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-wine-light" />
              <span>Decants 100% Genuinos</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-wine-light" />
              <span>Envíos en República Dominicana</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
