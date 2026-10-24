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
    <section className="relative w-full bg-noir text-white overflow-hidden border-b border-white/10">
      {/* 1. Full-Width Edge-to-Edge Campaign Visual Container */}
      <div className="relative w-full h-[72vh] sm:h-[78vh] lg:h-[84vh] min-h-[520px] max-h-[820px]">
        
        {/* Background Campaign Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-campaign.jpg"
          alt="Campaña Fragance Stock RD — Perfumes 100% Originales & Decants"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 transition-transform duration-1000 ease-out will-change-transform"
        />

        {/* Sophisticated Dark Gradient Overlays for Cinematic Contrast & Pure Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-noir/95 via-noir/65 to-noir/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-noir/40 z-10" />

        {/* Fine Architectural Grid Lines (Editorial Framing) */}
        <div className="absolute inset-0 z-15 pointer-events-none opacity-20 hidden lg:block">
          <div className="max-w-cowboy mx-auto h-full border-x border-white/10 flex justify-between px-12">
            <div className="w-[1px] h-full bg-white/5" />
            <div className="w-[1px] h-full bg-white/5" />
          </div>
        </div>

        {/* 2. Composition & Editorial Content */}
        <div className="relative z-20 h-full max-w-cowboy mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-between py-8 sm:py-12 lg:py-14">
          
          {/* Top Bar inside Hero: Subtle Micro-Typography */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-luxury text-white/60 pt-2">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-wine" />
              <span className="font-medium text-white/80">Fragance Stock RD • Edición 2026</span>
            </div>
            <span className="hidden sm:inline-block text-white/50 tracking-ultraWide">
              Santo Domingo • República Dominicana
            </span>
          </div>

          {/* Main Editorial Block */}
          <div className="max-w-2xl space-y-5 sm:space-y-6 pb-4 sm:pb-8">
            
            {/* Official Brand Logo Emblem (Transparent PNG) & Brand Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-light.png"
                alt="Fragance Stock RD"
                className="h-16 sm:h-24 w-auto object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)] self-start"
              />
              <div className="h-10 w-[1px] bg-white/20 hidden sm:block" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] uppercase tracking-widest text-white/90 w-fit">
                <i className="fa-solid fa-wand-magic-sparkles text-wine-light text-xs" />
                <span>Perfumes 100% Originales &amp; Decants en Cristal</span>
              </div>
            </div>

            {/* Short, Powerful Editorial Headline with Italic Nuance */}
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal leading-[0.96] tracking-tight text-white drop-shadow-md">
              Encuentra tu <br className="hidden sm:inline" />
              <span className="italic font-normal text-white">próxima fragancia</span>
            </h1>

            {/* Concise Secondary Description */}
            <p className="text-sm sm:text-base text-white/75 font-light leading-relaxed max-w-lg">
              Decants fraccionados estérilmente en atomizador de cristal y botellas selladas. Perfumes árabes legendarios y creaciones de nicho con proyección real.
            </p>

            {/* Single Primary Call-to-Action & Business Badges */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <Link
                href="#inventario"
                onClick={scrollToInventory}
                className="inline-flex items-center justify-center gap-3 bg-white text-noir hover:bg-wine hover:text-white px-8 py-4 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-2xl group cursor-pointer w-fit border border-white"
              >
                <span>Explorar perfumes</span>
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
              </Link>

              {/* Commercial Metrics Badge */}
              <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>+100 Clientes en RD</span>
                </span>
                <span className="text-white/40">•</span>
                <span className="inline-flex items-center gap-1.5 text-white/70">
                  <i className="fa-solid fa-truck-fast text-[11px]" />
                  <span>Envíos a todo el país</span>
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Micro-Strip */}
          <div className="hidden sm:flex items-center justify-between text-[11px] text-white/50 border-t border-white/10 pt-4">
            <span className="tracking-wide">01 — CURADURÍA EXCLUSIVA</span>
            <div className="flex items-center gap-6">
              <span>Decants 5 ml &amp; 10 ml</span>
              <span>•</span>
              <span>Frascos 100% Genuinos</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

