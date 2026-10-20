"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Compass, Droplet, ShieldCheck, ChevronDown } from "lucide-react";

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, { passive: true });
      if (!("ontouchstart" in window)) {
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[96vh] lg:min-h-screen flex flex-col justify-between bg-espresso overflow-hidden grain-overlay select-none"
    >
      {/* 1. Large Edge-to-Edge Hero Background Visual with Cinematic Clip-Path Reveal */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out will-change-transform"
        style={{
          clipPath: mounted
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 15%, 100% 15%, 100% 85%, 0 85%)",
          transform: mounted
            ? `translate3d(${mousePos.x * -0.3}px, ${mousePos.y * -0.3 + scrollY * 0.18}px, 0) scale(${1.04 + scrollY * 0.0003})`
            : "scale(1.08)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-campaign.jpg"
          alt="A&D Parfum Haute Parfumerie Campaign"
          className="w-full h-full object-cover object-[center_35%] lg:object-center filter brightness-[0.62] contrast-[1.18] saturate-[1.05]"
        />

        {/* Sophisticated Multi-Angle Darkening & Gold Light Auras */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-espresso/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/45 to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-champagne/15 rounded-full blur-[150px] pointer-events-none animate-pulseGlow" />
      </div>

      {/* 2. Top Campaign Monogram Bar */}
      <div className="relative z-20 max-w-editorial mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-10 w-full flex items-center justify-between">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-espresso/80 backdrop-blur-md border border-champagne/30 text-[11px] tracking-luxury text-champagne shadow-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse" />
          <span className="font-editorial text-xs italic text-sand tracking-wide">
            Maison de Haute Parfumerie
          </span>
          <span className="text-sand/30">•</span>
          <span className="text-porcelain uppercase font-semibold">Bogotá & Dubái</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px] tracking-luxury text-sand/70 uppercase">
          <span>Decants Extraídos Bajo Pedido</span>
          <span className="text-champagne/40">/</span>
          <span className="text-champagne font-medium">100% Extracto Genuino</span>
        </div>
      </div>

      {/* 3. Main Center Stage: Asymmetric Editorial Typography & Hero Dominance */}
      <div className="relative z-20 max-w-editorial mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Bold Asymmetric Headline with Staggered Line Breaks */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            
            <div className="space-y-2">
              <span className="block text-champagne font-editorial text-lg sm:text-xl md:text-2xl italic tracking-wider">
                Colección Exclusiva 2026
              </span>
              
              <h1 className="font-editorial text-porcelain tracking-tight">
                <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-normal leading-[0.88] uppercase tracking-[-0.03em] drop-shadow-md">
                  L&apos;Alchimie
                </span>
                <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light italic text-sand pl-3 sm:pl-10 lg:pl-16 leading-[0.92] drop-shadow-sm">
                  de la Piel
                </span>
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-sand/85 font-light leading-relaxed max-w-xl">
              Curaduría de alta perfumería oriental y nicho internacional. Botellas completas de colección y decants fraccionados de 5&nbsp;ml y 10&nbsp;ml en atomizadores de cristal puro, preservando la concentración y estela original.
            </p>

            {/* Olfactory Notes Spectrum Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-3.5 py-1.5 rounded-full bg-espresso/70 border border-sand/20 text-sand/90 backdrop-blur-md">
                Canela de Ceilán
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-espresso/70 border border-sand/20 text-sand/90 backdrop-blur-md">
                Dátiles de Arabia
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-espresso/70 border border-sand/20 text-sand/90 backdrop-blur-md">
                Vainilla Bourbon
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-espresso/70 border border-sand/20 text-sand/90 backdrop-blur-md">
                Ámbar & Maderas
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-champagne/20 border border-champagne/45 text-champagne-light backdrop-blur-md font-medium">
                Atomizador de Cristal
              </span>
            </div>

            {/* Direct Commercial CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/perfumes"
                className="btn-gold py-4 px-8 text-xs flex items-center justify-center gap-2.5 group shadow-2xl font-semibold tracking-wide"
              >
                <span>Explorar Colección de Fragancias</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>

              <Link
                href="/perfumes?category=cat-decants"
                className="btn-secondary border-sand/40 text-porcelain hover:bg-sand/15 hover:border-champagne py-4 px-8 text-xs text-center tracking-wide backdrop-blur-sm"
              >
                Probar Decants (5ml y 10ml)
              </Link>
            </div>

          </div>

          {/* Right Column: Floating Luxury Hologram Badge & Brand Emblem */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div
              className="relative p-7 sm:p-9 rounded-cowboy bg-espresso/75 backdrop-blur-xl border border-champagne/35 shadow-[0_25px_60px_rgba(0,0,0,0.7)] space-y-5 max-w-sm w-full transition-transform duration-700 ease-out group hover:border-champagne"
              style={{
                transform: mounted
                  ? `translate3d(${mousePos.x * 0.35}px, ${mousePos.y * 0.35}px, 0)`
                  : "none",
              }}
            >
              <div className="flex items-center justify-between border-b border-sand/15 pb-3.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-champagne" />
                  <span className="text-[10px] uppercase tracking-luxury text-champagne font-bold">
                    Certificación de Origen
                  </span>
                </div>
                <span className="text-[10px] text-sand/50 tracking-wider">A&D 2026</span>
              </div>

              {/* Logo Glow Stage */}
              <div className="py-4 text-center relative">
                <div className="absolute inset-0 bg-champagne/10 rounded-full blur-xl pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-light.png"
                  alt="A&D Parfum"
                  className="h-24 sm:h-28 w-auto mx-auto object-contain filter drop-shadow-[0_4px_20px_rgba(204,167,39,0.4)] transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="space-y-1.5 text-center">
                <p className="font-editorial text-base text-porcelain italic font-light leading-snug">
                  &quot;El perfume no se compra a ciegas; se vive y evoluciona en la propia piel.&quot;
                </p>
                <p className="text-[11px] text-sand/65 font-light">
                  Muestras desde <strong className="text-champagne font-semibold">$ 30.000 COP</strong>
                </p>
              </div>

              <div className="pt-3 border-t border-sand/15 flex items-center justify-between text-xs">
                <span className="text-[10px] text-sand/60 uppercase">Envío Colombia</span>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  En Stock Inmediato
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Bottom Editorial Transition Bar into the Catalog */}
      <div className="relative z-20 border-t border-sand/15 bg-espresso/80 backdrop-blur-md">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Category Quick Levers */}
          <div className="flex items-center flex-wrap justify-center gap-6 text-[12px] text-sand/80 font-medium">
            <Link
              href="/perfumes?category=cat-arabes"
              className="hover:text-champagne transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-champagne/60" />
              <span>Perfumes Árabes</span>
            </Link>
            <Link
              href="/perfumes?category=cat-decants"
              className="hover:text-champagne transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
              <span className="text-porcelain font-semibold">Decants & Muestras</span>
            </Link>
            <Link
              href="/perfumes?category=cat-masculinos"
              className="hover:text-champagne transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-champagne/60" />
              <span>Masculinos de Élite</span>
            </Link>
            <Link
              href="/#descubrimiento"
              className="hover:text-champagne transition-colors flex items-center gap-1.5 text-champagne-light"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explorador Olfativo</span>
            </Link>
          </div>

          {/* Scroll Cue Indicator */}
          <div className="flex items-center gap-2 text-sand/60 hover:text-champagne transition-colors cursor-pointer">
            <span className="text-[10px] uppercase tracking-luxury">Desplazar hacia abajo</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-champagne" />
          </div>

        </div>
      </div>

    </section>
  );
}
