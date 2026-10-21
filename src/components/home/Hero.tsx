"use client";

import React from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

export function Hero() {
  const scrollToInventory = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById("inventario");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full bg-noir text-white overflow-hidden">
      {/* 1. Full-Width Edge-to-Edge Campaign Visual Container */}
      <div className="relative w-full h-[68vh] sm:h-[74vh] lg:h-[80vh] min-h-[480px] max-h-[780px]">
        
        {/* Background Campaign Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-campaign.jpg"
          alt="Campaña A&D Parfum — Alta Perfumería & Decants de Lujo"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 transition-transform duration-1000 ease-out will-change-transform"
        />

        {/* Sophisticated Dark Gradient Overlays for Cinematic Contrast & Pure Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-noir/90 via-noir/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-noir/40 z-10" />

        {/* 2. Composition & Content */}
        <div className="relative z-20 h-full max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-2xl space-y-4 sm:space-y-5">
            
            {/* Subtle Brand Tag */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] uppercase tracking-luxury text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-wine" />
              <span>Colección Oficial • República Dominicana</span>
            </div>

            {/* Short, Powerful Editorial Headline */}
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal leading-[0.98] tracking-tight text-white drop-shadow-md">
              Encuentra tu próxima fragancia
            </h1>

            {/* Concise Secondary Description */}
            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-xl">
              Decants genuinos fraccionados bajo pedido en atomizadores de cristal y botellas selladas. La curaduría definitiva de perfumería árabe y de nicho.
            </p>

            {/* Single Primary Call-to-Action & Business Badges */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <Link
                href="#inventario"
                onClick={scrollToInventory}
                className="inline-flex items-center justify-center gap-2.5 bg-white text-noir hover:bg-wine hover:text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-xl group cursor-pointer w-fit"
              >
                <span>Explorar perfumes</span>
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </Link>

              {/* Commercial Metrics Badge */}
              <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>+100 Clientes en RD</span>
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/70">Envíos a todo el país</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
