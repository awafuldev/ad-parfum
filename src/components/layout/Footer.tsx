import React from "react";
import Link from "next/link";
import { Instagram, ArrowUpRight, ShieldCheck, Truck, Users, Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-noir text-white py-12 border-t border-white/10">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Business Credentials Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-white/10 text-center mb-8">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-wine-light">
              <Users className="w-4 h-4" />
              <span className="font-sans font-bold text-base text-white">+100 Clientes</span>
            </div>
            <p className="text-[11px] text-white/60">Satisfechos en República Dominicana</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-wine-light">
              <Truck className="w-4 h-4" />
              <span className="font-sans font-bold text-base text-white">Envíos a Todo RD</span>
            </div>
            <p className="text-[11px] text-white/60">Santo Domingo, Santiago y provincias</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-wine-light">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-sans font-bold text-base text-white">100% Genuino</span>
            </div>
            <p className="text-[11px] text-white/60">Decants extraídos en cristal neutro</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-wine-light">
              <Star className="w-4 h-4 fill-wine-light" />
              <span className="font-sans font-bold text-base text-white">5.0 Estrellas</span>
            </div>
            <p className="text-[11px] text-white/60">Garantía oficial de fijación y origen</p>
          </div>
        </div>

        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-10 border-b border-white/10 text-center md:text-left">
          
          {/* Brand Info & Logo */}
          <div className="space-y-3 max-w-sm">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-light.png"
                alt="Fragance Stock RD"
                className="h-10 w-auto object-contain mx-auto md:mx-0"
              />
            </Link>
            <p className="text-xs text-white/70 font-light leading-relaxed">
              Perfumes 100% originales para hombres y mujeres, decants exclusivos en cristal y presentaciones completas. Delivery en Santo Domingo y envíos a toda República Dominicana.
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
              href="https://www.instagram.com/fragancestockrd/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-wine-light" />
              <span>@fragancestockrd</span>
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

        {/* Bottom Bar: Copyright, Guarantees & Official CETU Studios Badge */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] text-white/60">
          <p>© {new Date().getFullYear()} Fragance Stock RD. Todos los derechos reservados.</p>
          
          {/* CETU Studios Credit with Official Badge (same as EBC Dominicana) */}
          <a
            href="https://instagram.com/cetustudios"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#161310] hover:bg-[#221b16] border border-white/15 hover:border-wine/50 px-4 py-2 rounded-full transition-all duration-300 shadow-md group"
            title="Desarrollado por CETU Studios"
          >
            <span className="text-[11.5px] text-white/85 font-medium tracking-wide">
              Desarrollado por
            </span>
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/cetu-studios.png"
                alt="CETU Studios Logo"
                className="h-6 w-6 rounded-md object-cover shadow-sm transition-transform duration-300 group-hover:scale-110"
              />
              <span className="font-sans text-[12px] font-extrabold tracking-widest text-white uppercase leading-none">
                CETU STUDIOS
              </span>
            </div>
          </a>
        </div>

      </div>
    </footer>
  );
}
