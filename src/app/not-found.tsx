import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-28 bg-porcelain text-center">
      <div className="max-w-md mx-auto px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-sand/30 border border-sand flex items-center justify-center mx-auto text-champagne">
          <Compass className="w-8 h-8" />
        </div>
        <span className="text-[10px] uppercase font-semibold tracking-luxury text-taupe">
          Página No Encontrada • Error 404
        </span>
        <h1 className="font-editorial text-4xl font-normal text-espresso">
          El aroma que buscas no está disponible
        </h1>
        <p className="text-xs text-smoke leading-relaxed font-light">
          La fragancia o sección que buscas en A&D Parfum ha cambiado de ubicación o ya no se encuentra en nuestro catálogo activo.
        </p>
        <div className="pt-4">
          <Link href="/perfumes" className="btn-gold text-xs">
            <span>Regresar al Catálogo A&D</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
