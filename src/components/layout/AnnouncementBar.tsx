import React from "react";
import Link from "next/link";
import { Instagram, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <aside aria-label="Anuncios de A&D Parfum" className="bg-espresso text-porcelain text-[11px] py-2 px-4 border-b border-espresso/90 tracking-wide">
      <div className="max-w-cowboy mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-sand/80">
          <span className="font-editorial italic text-xs text-champagne">Haute Parfumerie</span>
          <span>•</span>
          <span>Colección Oficial 2026</span>
        </div>

        <p className="text-center w-full md:w-auto font-medium tracking-tight">
          Envíos a toda Colombia • Muestras fraccionadas en atomizadores de cristal neutro de alta precisión
        </p>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="https://www.instagram.com/adparfum/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sand hover:text-champagne transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@adparfum</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
