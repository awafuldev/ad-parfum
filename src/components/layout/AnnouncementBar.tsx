import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";

export function AnnouncementBar() {
  return (
    <aside aria-label="Anuncios de Fragance Stock RD" className="bg-espresso text-porcelain text-[11px] py-2 px-4 border-b border-espresso/90 tracking-wide">
      <div className="max-w-cowboy mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-sand/80">
          <span className="font-editorial italic text-xs text-champagne">Fragance Stock RD</span>
          <span>•</span>
          <span>Colección 2026</span>
        </div>

        <p className="text-center w-full md:w-auto font-medium tracking-tight">
          Fragance Stock RD — República Dominicana • Perfumes 100% Originales y Decants en cristal
        </p>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="https://www.instagram.com/fragancestockrd/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sand hover:text-champagne transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@fragancestockrd</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
