"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Droplet, Sparkles, Filter } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { RevealOnScroll } from "@/components/ui/motion/RevealOnScroll";
import { GlassTiltCard } from "@/components/ui/motion/GlassTiltCard";

interface Props {
  products: Product[];
}

export function OlfactoryExplorer({ products }: Props) {
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");

  const families = [
    { id: "all", label: "Todas las Familias" },
    { id: "Ámbar Cálido & Especiado", label: "Ámbar Cálido & Canela" },
    { id: "Acuático & Cítrico Amaderado", label: "Acuático & Fresco Marino" },
    { id: "Frutal Gourmand", label: "Frutal Gourmand & Dulce" },
    { id: "Amaderado Oriental", label: "Maderas Nobles & Oud" },
    { id: "Floral Dulce", label: "Floral & Malvavisco" },
    { id: "Cuero & Ahumado", label: "Cuero & Abedul Ahumado" },
  ];

  const occasions = [
    { id: "all", label: "Cualquier Ocasión" },
    { id: "Noche", label: "Noche & Citas Románticas" },
    { id: "Diario", label: "Diario, Universidad & Trabajo" },
    { id: "Verano", label: "Calor & Clima Tropical" },
    { id: "Frío", label: "Clima Templado / Otoño-Invierno" },
  ];

  const filtered = products.filter((p) => {
    const matchFamily = selectedFamily === "all" || p.olfactory_family === selectedFamily;
    const matchOccasion =
      selectedOccasion === "all" ||
      p.occasion.toLowerCase().includes(selectedOccasion.toLowerCase()) ||
      p.season.toLowerCase().includes(selectedOccasion.toLowerCase());
    return matchFamily && matchOccasion;
  });

  return (
    <section id="descubrimiento" className="py-28 bg-espresso text-porcelain border-b border-espresso scroll-mt-20 relative overflow-hidden grain-overlay">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none animate-pulseGlow" />

      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Introduction */}
        <RevealOnScroll direction="up" delayMs={50}>
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand/10 border border-champagne/30 text-sand text-xs font-medium mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-champagne" />
              <span className="font-editorial text-xs italic text-champagne">Santuario Olfativo A&D</span>
            </div>
            <h2 className="heading-section text-porcelain font-editorial">
              Arquitectura de Notas & Esencias
            </h2>
            <p className="text-sm text-sand/75 mt-3 leading-relaxed font-light">
              Cada creación aromática es una estructura viva de tiempo y química. Filtra por acordes dominantes u ocasiones para descubrir la composición exacta que resonará con tu identidad en A&D Parfum.
            </p>
          </div>
        </RevealOnScroll>

        {/* Filter Controls (Atmospheric Pill System) */}
        <div className="space-y-6 mb-14">
          {/* Families */}
          <div>
            <span className="text-[10px] uppercase tracking-luxury font-semibold text-champagne block mb-3">
              Familia Olfativa Dominante:
            </span>
            <div className="flex flex-wrap gap-2">
              {families.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFamily(f.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                    selectedFamily === f.id
                      ? "bg-champagne text-espresso font-semibold shadow-lg shadow-champagne/20 scale-105"
                      : "bg-sand/10 border border-sand/20 text-sand/80 hover:border-sand hover:text-porcelain"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Occasions */}
          <div>
            <span className="text-[10px] uppercase tracking-luxury font-semibold text-champagne block mb-3">
              Ocasión o Clima Recomendado:
            </span>
            <div className="flex flex-wrap gap-2">
              {occasions.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOccasion(o.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                    selectedOccasion === o.id
                      ? "bg-champagne text-espresso font-semibold shadow-lg shadow-champagne/20 scale-105"
                      : "bg-sand/10 border border-sand/20 text-sand/80 hover:border-sand hover:text-porcelain"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Live Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-sand/10 rounded-cowboy p-16 text-center border border-sand/20 backdrop-blur-md">
              <Droplet className="w-8 h-8 text-champagne mx-auto mb-3" />
              <h3 className="font-editorial text-xl text-porcelain font-normal mb-1">
                No hay fragancias con esta combinación exacta
              </h3>
              <p className="text-xs text-sand/70 mb-4 font-light">
                Selecciona &quot;Todas las Familias&quot; para desplegar la colección completa.
              </p>
              <button
                onClick={() => {
                  setSelectedFamily("all");
                  setSelectedOccasion("all");
                }}
                className="btn-gold text-xs"
              >
                Restablecer Explorador
              </button>
            </div>
          ) : (
            filtered.map((prod, idx) => {
              const minPrice = Math.min(...prod.variants.map((v) => v.price));
              return (
                <RevealOnScroll
                  key={prod.id}
                  direction="up"
                  delayMs={idx * 60}
                  className="h-full"
                >
                  <GlassTiltCard className="h-full bg-charcoal/90 rounded-cowboy border border-sand/20 hover:border-champagne/60 overflow-hidden flex flex-col justify-between transition-all duration-500 group shadow-md hover:shadow-2xl">
                    <div>
                      <Link
                        href={`/perfumes/${prod.id}`}
                        className="block aspect-[4/5] bg-espresso relative overflow-hidden glass-sheen"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.primary_image}
                          alt={prod.name}
                          className="w-full h-full object-cover transition-transform duration-800 ease-out group-hover:scale-108 filter brightness-95"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="bg-espresso/90 text-champagne text-[10px] px-2.5 py-0.5 rounded-full font-medium border border-champagne/30 backdrop-blur-sm">
                            {prod.concentration}
                          </span>
                        </div>
                      </Link>

                      <div className="p-5">
                        <p className="text-[10px] uppercase font-semibold tracking-luxury text-sand/60 mb-1">
                          {prod.brand_name}
                        </p>
                        <Link href={`/perfumes/${prod.id}`}>
                          <h4 className="font-editorial text-xl font-normal text-porcelain line-clamp-1 mb-1.5 group-hover:text-champagne transition-colors">
                            {prod.name}
                          </h4>
                        </Link>
                        <p className="text-xs text-sand/70 line-clamp-2 mb-3 font-light leading-relaxed">
                          {prod.short_description}
                        </p>

                        {/* Key notes */}
                        <div className="text-[11px] text-sand/80 space-y-1 pt-3 border-t border-sand/15 font-light">
                          <div className="flex items-center gap-1.5">
                            <span className="text-champagne font-medium">Notas:</span>
                            <span className="line-clamp-1 text-porcelain">
                              {prod.top_notes.slice(0, 2).join(", ")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-champagne font-medium">Fijación:</span>
                            <span className="text-porcelain">{prod.longevity}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-sand/15 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-sand/60 block uppercase font-medium">Decants desde</span>
                        <span className="text-sm font-semibold text-champagne">
                          {formatPrice(minPrice)}
                        </span>
                      </div>

                      <Link
                        href={`/perfumes/${prod.id}`}
                        className="btn-gold text-xs py-2 px-3.5"
                      >
                        <span>Ver Ficha</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </GlassTiltCard>
                </RevealOnScroll>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
