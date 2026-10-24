"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Droplets, Clock, ShieldCheck, Flame, Compass } from "lucide-react";

interface Phase {
  index: string;
  title: string;
  subtitle: string;
  headline: string;
  description: string;
  notes: string[];
  image: string;
  imageAlt: string;
  metric: { label: string; value: string };
  badge: string;
  colorTone: string;
}

const PHASES: Phase[] = [
  {
    index: "01",
    title: "La Récolte",
    subtitle: "Materia Prima & Aceites Esenciales",
    headline: "El Origen de la Esencia Pura",
    description:
      "Selección manual de canela silvestre de Ceilán, vainas de vainilla Bourbon de Madagascar y resinas ámbar cosechadas en su punto óptimo de maduración olfativa.",
    notes: ["Canela de Ceilán", "Vainilla Bourbon", "Dátiles Confitados", "Nuez Moscada"],
    image: "/images/alchemy-ingredients.jpg",
    imageAlt: "Ingredientes botánicos y alambique de perfumería Fragance Stock RD",
    metric: { label: "Pureza de Extracto", value: "100% Genuino" },
    badge: "Fase Botánica",
    colorTone: "from-amber-950/80 via-espresso/90 to-espresso",
  },
  {
    index: "02",
    title: "La Maceration",
    subtitle: "Alquimia & Reposo en Cristal",
    headline: "La Paciencia del Frasco Oscuro",
    description:
      "Maceración controlada en barricas de cristal neutro durante 90 días. Los aceites se integran a una concentración del 30%+ (Pure Parfum), creando acordes aterciopelados y estelas imponentes.",
    notes: ["Resina de Benjuí", "Abedul Ahumado", "Cuero Noble", "Ámbar Gris"],
    image: "/images/noir-crystal.jpg",
    imageAlt: "Frasco de cristal negro macerado sobre mármol negro",
    metric: { label: "Concentración de Aceites", value: "30% - 35% Pure Parfum" },
    badge: "Fase de Maceración",
    colorTone: "from-stone-950/90 via-espresso/90 to-espresso",
  },
  {
    index: "03",
    title: "La Diffusion",
    subtitle: "Extracción Bajo Pedido & Piel",
    headline: "El Momento de la Revelación",
    description:
      "Cada decant es fraccionado en nuestro laboratorio bajo pedido directo en atomizadores de cristal neutro de rosca hermética. Bruma ultra fina que respeta la pirámide olfativa completa durante más de 14 horas.",
    notes: ["Bruma Ultra Fina", "Cristal Neutro", "Cero Plásticos", "14-16h de Fijación"],
    image: "/images/hero-campaign.jpg",
    imageAlt: "Frasco luminoso de perfume Fragance Stock RD",
    metric: { label: "Longevidad en Piel", value: "12 a 16 Horas" },
    badge: "Fase de Emisión",
    colorTone: "from-amber-900/80 via-espresso/90 to-espresso",
  },
];

export function SignatureMotionExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      // Calculate progress relative to container top
      const currentScroll = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setScrollProgress(rawProgress);

      // Determine active phase
      if (rawProgress < 0.33) {
        setActivePhaseIndex(0);
      } else if (rawProgress < 0.67) {
        setActivePhaseIndex(1);
      } else {
        setActivePhaseIndex(2);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const activePhase = PHASES[activePhaseIndex];

  return (
    <section
      ref={containerRef}
      className="relative bg-espresso text-porcelain grain-overlay border-b border-sand/15"
      style={{
        // 250vh scroll track on desktop for smooth cinematic scrub
        minHeight: isMobile ? "auto" : "260vh",
      }}
    >
      {/* Sticky Cinematic Viewport */}
      <div className={`${isMobile ? "py-20" : "sticky top-0 h-screen"} flex flex-col justify-between overflow-hidden`}>
        
        {/* Top Phase Track Bar */}
        <div className="relative z-20 max-w-editorial mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-10 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand/15 pb-4">
            
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
              <span className="text-[10px] uppercase tracking-luxury text-champagne font-bold">
                Metamorfosis Olfativa Fragance Stock RD
              </span>
              <span className="text-sand/30">•</span>
              <span className="text-xs font-editorial italic text-sand">L&apos;Art de l&apos;Extraction</span>
            </div>

            {/* Step Selector & Progress Bar */}
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {PHASES.map((phase, idx) => (
                <button
                  key={phase.index}
                  onClick={() => {
                    setActivePhaseIndex(idx);
                    if (containerRef.current && !isMobile) {
                      const rect = containerRef.current.getBoundingClientRect();
                      const targetTop =
                        window.scrollY + rect.top + (idx / 2.5) * (rect.height - window.innerHeight);
                      window.scrollTo({ top: targetTop, behavior: "smooth" });
                    }
                  }}
                  className={`group flex items-center gap-2 text-xs transition-all duration-300 py-1 px-3 rounded-full ${
                    activePhaseIndex === idx
                      ? "bg-sand/15 border border-champagne text-champagne font-semibold shadow-lg"
                      : "text-sand/50 hover:text-sand"
                  }`}
                >
                  <span className="text-[10px] font-mono">{phase.index}</span>
                  <span className="hidden md:inline text-[11px] uppercase tracking-wider">{phase.title}</span>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Center Stage: Split Screen Motion Display */}
        <div className="relative z-20 max-w-editorial mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 w-full flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full">
            
            {/* Left: Large Editorial Image with Dynamic Crossfade & Scale Scrub */}
            <div className="lg:col-span-7 relative order-2 lg:order-1">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-cowboy overflow-hidden border border-sand/20 shadow-[0_30px_90px_rgba(0,0,0,0.8)] bg-stone-950 group">
                
                {/* Crossfading Image Stack */}
                {PHASES.map((p, idx) => (
                  <div
                    key={p.index}
                    className="absolute inset-0 transition-opacity duration-700 ease-out"
                    style={{
                      opacity: activePhaseIndex === idx ? 1 : 0,
                      transform: activePhaseIndex === idx ? "scale(1)" : "scale(1.06)",
                      transition: "opacity 0.8s ease-in-out, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.imageAlt}
                      className="w-full h-full object-cover filter brightness-[0.78] contrast-[1.15]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso via-transparent to-transparent opacity-80" />
                  </div>
                ))}

                {/* Floating Metric Badge on Image */}
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto z-10 p-4 rounded-cowboy bg-espresso/80 backdrop-blur-md border border-sand/25 flex items-center gap-4 shadow-xl">
                  <div className="w-10 h-10 rounded-full bg-champagne/15 border border-champagne/40 flex items-center justify-center text-champagne flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-luxury text-sand/70 block">
                      {activePhase.metric.label}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-champagne">
                      {activePhase.metric.value}
                    </span>
                  </div>
                </div>

                {/* Step Watermark */}
                <div className="absolute top-4 right-4 z-10 text-[11px] font-mono px-3 py-1 rounded-full bg-espresso/70 border border-sand/20 text-champagne tracking-wider">
                  FASE {activePhase.index} / 03
                </div>

              </div>
            </div>

            {/* Right: Editorial Narrative Content */}
            <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/10 border border-champagne/30 text-[11px] text-champagne">
                  <Flame className="w-3.5 h-3.5 text-champagne" />
                  <span>{activePhase.badge}</span>
                </div>

                <p className="text-xs uppercase tracking-luxury text-sand/60 font-semibold">
                  {activePhase.subtitle}
                </p>

                <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-porcelain leading-tight">
                  {activePhase.headline}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-sand/80 font-light leading-relaxed">
                {activePhase.description}
              </p>

              {/* Accords list */}
              <div className="space-y-2 pt-2 border-t border-sand/15">
                <span className="text-[10px] uppercase tracking-luxury text-champagne font-semibold block">
                  Compromiso de Elaboración:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activePhase.notes.map((n, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-sand/10 border border-sand/20 text-xs text-sand/90"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/perfumes?category=cat-decants"
                  className="btn-gold py-3.5 px-7 text-xs flex items-center gap-2 group shadow-xl"
                >
                  <span>Probar Muestras Extraídas</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/#descubrimiento"
                  className="text-xs text-sand/80 hover:text-champagne transition-colors underline-offset-4 hover:underline"
                >
                  Ver Pirámide Olfativa
                </Link>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom Scroll Scrubber Indicator */}
        <div className="relative z-20 max-w-editorial mx-auto px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8 w-full">
          <div className="flex items-center justify-between text-xs text-sand/60">
            <span className="text-[11px] uppercase tracking-wider">
              {isMobile ? "Toca las fases para explorar" : "Desplaza para transformar la composición"}
            </span>

            {/* Scrub Progress Bar */}
            <div className="w-36 sm:w-64 h-1 bg-sand/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-champagne rounded-full transition-all duration-300"
                style={{
                  width: `${isMobile ? ((activePhaseIndex + 1) / 3) * 100 : Math.max(15, scrollProgress * 100)}%`,
                }}
              />
            </div>

            <span className="font-mono text-champagne text-xs">
              0{activePhaseIndex + 1} / 03
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
