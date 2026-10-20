"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Droplets, ShieldCheck, Clock, Compass } from "lucide-react";

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      // Subtle dampening for luxury camera parallax
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      setMousePos({ x, y });
    };

    if (typeof window !== "undefined" && !("ontouchstart" in window)) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-[92vh] lg:min-h-[96vh] flex items-center justify-center bg-espresso overflow-hidden grain-overlay select-none">
      
      {/* 1. Cinematic Studio Background with Directional Light & Atmospheric Depth */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-1000 ease-out will-change-transform"
        style={{
          transform: mounted
            ? `translate3d(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px, 0) scale(1.05)`
            : "scale(1.02)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=2400&q=95"
          alt="A&D Parfum Haute Parfumerie Campaign"
          className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.25] saturate-[0.9]"
        />

        {/* Multi-layered Studio Light Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/70 to-espresso/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/80 to-transparent" />
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-champagne/10 rounded-full blur-[120px] pointer-events-none animate-pulseGlow" />
      </div>

      {/* 2. Main Content Architecture */}
      <div className="relative z-10 max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        
        {/* Brand Stamp & Monogram Emblem Header */}
        <div className="flex flex-col items-center lg:items-start mb-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sand/10 backdrop-blur-md border border-champagne/35 text-[11px] font-medium tracking-luxury text-champagne mb-4 shadow-lg animate-fadeInUp">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse" />
            <span className="font-editorial text-xs italic text-sand">Maison de Haute Parfumerie</span>
            <span className="text-sand/30">•</span>
            <span className="text-porcelain uppercase font-semibold">Dubái & Nicho 2026</span>
          </div>
        </div>

        {/* Asymmetrical Editorial Composition Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left / Editorial Typography & Purchasing Intent */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            <h1 className="heading-hero text-porcelain font-editorial max-w-2xl mx-auto lg:mx-0">
              La memoria olfativa hecha{" "}
              <span className="italic font-light text-champagne-light drop-shadow-sm">
                obra de arte.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-sand/85 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              Curaduría exclusiva de elixires de Medio Oriente y perfumería de autor. Botellas completas de colección y decants fraccionados de 5ml y 10ml en atomizadores de cristal puro, extraídos bajo pedido.
            </p>

            {/* Olfactory Notes Micro-Strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-full bg-sand/10 border border-sand/20 text-sand/90 backdrop-blur-sm">
                Canela de Ceilán
              </span>
              <span className="px-3 py-1 rounded-full bg-sand/10 border border-sand/20 text-sand/90 backdrop-blur-sm">
                Dátiles de Arabia
              </span>
              <span className="px-3 py-1 rounded-full bg-sand/10 border border-sand/20 text-sand/90 backdrop-blur-sm">
                Vainilla Bourbon
              </span>
              <span className="px-3 py-1 rounded-full bg-champagne/15 border border-champagne/40 text-champagne-light backdrop-blur-sm font-medium">
                Cristalería de Lujo
              </span>
            </div>

            {/* Direct Action Group */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4">
              <Link
                href="/perfumes"
                className="btn-gold py-4 px-8 text-xs flex items-center justify-center gap-2 group tracking-wide font-medium shadow-2xl"
              >
                <span>Explorar Colección de Fragancias</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>

              <Link
                href="/perfumes?category=cat-decants"
                className="btn-secondary border-sand/35 text-porcelain hover:bg-sand/15 hover:border-champagne py-4 px-8 text-xs text-center tracking-wide"
              >
                Probar Decants (5ml y 10ml)
              </Link>
            </div>

            {/* Colombian Nationwide Shipping & Trust Marks */}
            <div className="pt-6 border-t border-sand/15 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-sand/75 text-left">
              <div className="space-y-0.5">
                <p className="font-semibold text-porcelain flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
                  100% Extracto Genuino
                </p>
                <p className="text-[11px] text-sand/55 font-light">Directo de botellas oficiales</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-porcelain flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
                  Atomizador de Cristal
                </p>
                <p className="text-[11px] text-sand/55 font-light">Bruma fina sin plásticos</p>
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-0.5">
                <p className="font-semibold text-porcelain flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
                  Envíos en Colombia
                </p>
                <p className="text-[11px] text-sand/55 font-light">Bogotá, Medellín, Cali y más</p>
              </div>
            </div>

          </div>

          {/* Right / Sculptural Bottle Showcase & Official Logo Integration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              className="relative w-full max-w-md p-8 sm:p-10 rounded-cowboy bg-espresso-card/80 backdrop-blur-2xl border border-champagne/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-6 transition-transform duration-700 ease-out group"
              style={{
                transform: mounted
                  ? `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`
                  : "none",
              }}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-sand/15 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-champagne" />
                  <span className="text-[10px] uppercase tracking-luxury text-champagne font-bold">
                    Sello de Pureza A&D
                  </span>
                </div>
                <span className="text-[10px] text-sand/50 tracking-wider">Edición 2026</span>
              </div>

              {/* Official Logo Presentation with Soft Gold Glow */}
              <div className="py-6 text-center relative">
                <div className="absolute inset-0 bg-champagne/5 rounded-full blur-2xl pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-light.png"
                  alt="A&D Parfum"
                  className="h-28 sm:h-32 w-auto mx-auto object-contain filter drop-shadow-[0_4px_16px_rgba(204,167,39,0.3)] transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Fragrance Philosophy Quote */}
              <div className="space-y-2 text-center lg:text-left">
                <p className="font-editorial text-lg text-porcelain italic font-light leading-snug">
                  &quot;El perfume no se compra a ciegas; se experimenta y se transforma en la propia piel.&quot;
                </p>
                <p className="text-[11px] text-sand/65 font-light leading-relaxed">
                  Cada decant es extraído bajo pedido en nuestro laboratorio para preservar las notas de salida y aceites esenciales intactos.
                </p>
              </div>

              {/* Pricing & Link */}
              <div className="pt-4 border-t border-sand/15 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-sand/60 block uppercase font-medium">Muestras de Autor Desde</span>
                  <span className="text-base font-semibold text-champagne">$ 30.000 COP</span>
                </div>
                <Link
                  href="/perfumes?category=cat-decants"
                  className="inline-flex items-center gap-1.5 text-xs text-porcelain hover:text-champagne transition-colors font-medium"
                >
                  <span>Ver Formatos</span>
                  <ArrowRight className="w-3.5 h-3.5 text-champagne" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Subtle Scroll Cue */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
        <span className="text-[9px] uppercase tracking-luxury text-sand">Descubrir</span>
        <div className="w-4 h-7 rounded-full border border-sand/40 flex items-start justify-center p-1">
          <span className="w-1 h-1.5 rounded-full bg-champagne animate-bounce" />
        </div>
      </div>

    </section>
  );
}
