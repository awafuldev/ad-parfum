"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Droplet,
  Sparkles,
  Flame,
  Waves,
  Apple,
  TreePine,
  Flower2,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { RevealOnScroll } from "@/components/ui/motion/RevealOnScroll";
import { GlassTiltCard } from "@/components/ui/motion/GlassTiltCard";

interface Props {
  products: Product[];
}

interface FamilyCard {
  id: string;
  name: string;
  archetype: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgGradient: string;
  dominantNotes: string;
  image: string;
  description: string;
}

const FAMILIES_DATA: FamilyCard[] = [
  {
    id: "all",
    name: "Todas las Familias",
    archetype: "El Espectro Completo",
    icon: Sparkles,
    accentColor: "#CCA727",
    bgGradient: "from-amber-950/70 via-espresso/90 to-espresso",
    dominantNotes: "Gourmand, Cítricos, Cuero, Maderas, Resinas",
    image: "/images/hero-campaign.jpg",
    description: "Explora la totalidad de nuestra curaduría: desde elixires opulentos de Dubái hasta bestias acuáticas premiadas.",
  },
  {
    id: "Ámbar Cálido & Especiado",
    name: "Ámbar & Especias",
    archetype: "El Abrazo Hipnótico",
    icon: Flame,
    accentColor: "#E2A83B",
    bgGradient: "from-amber-950/90 via-espresso/95 to-espresso",
    dominantNotes: "Canela de Ceilán, Dátiles, Praliné, Vainilla Bourbon",
    image: "/images/alchemy-ingredients.jpg",
    description: "Acordes cálidos y suntuosos que envuelven la piel en dulzura especiada. Proyección magnética para climas frescos y noches inolvidables.",
  },
  {
    id: "Acuático & Cítrico Amaderado",
    name: "Acuático & Marino",
    archetype: "La Brisa Oceánica",
    icon: Waves,
    accentColor: "#38BDF8",
    bgGradient: "from-sky-950/80 via-espresso/95 to-espresso",
    dominantNotes: "Brisa Marina, Manzana Italiana, Ciruela, Ámbar Gris",
    image: "/images/azure-aquatic.jpg",
    description: "Frescura radiante con fondo de maderas y ámbar gris. Diseñado para irradiar energía, limpieza y magnetismo en calor o uso diario.",
  },
  {
    id: "Frutal Gourmand",
    name: "Frutal Gourmand",
    archetype: "La Noche Inmortal",
    icon: Apple,
    accentColor: "#F472B6",
    bgGradient: "from-rose-950/80 via-espresso/95 to-espresso",
    dominantNotes: "Manzana Silvestre, Lavanda, Vainilla, Haba Tonka",
    image: "/images/hero-campaign.jpg",
    description: "El perfil más elogiado para eventos sociales y salidas nocturnas. Dulzura adictiva con una fijación ultra potente de hasta 14 horas.",
  },
  {
    id: "Amaderado Oriental",
    name: "Maderas & Oud",
    archetype: "La Autoridad Noble",
    icon: TreePine,
    accentColor: "#A3E635",
    bgGradient: "from-emerald-950/80 via-espresso/95 to-espresso",
    dominantNotes: "Pimienta Negra, Café Tostado, Tabaco Rubio, Benjuí",
    image: "/images/noir-crystal.jpg",
    description: "Carácter oscuro y distinguido. Mezclas complejas de tabaco, iris y resinas preciosas que transmiten madurez y elegancia formal.",
  },
  {
    id: "Cuero & Ahumado",
    name: "Cuero & Ahumado",
    archetype: "La Firma Aristocrática",
    icon: Droplet,
    accentColor: "#CBD5E1",
    bgGradient: "from-slate-950/90 via-espresso/95 to-espresso",
    dominantNotes: "Abedul Negro, Grosellas, Piña Ácida, Almizcle",
    image: "/images/noir-crystal.jpg",
    description: "El estándar de oro en versatilidad masculina. Salida cítrica ahumada que evoluciona hacia un secado penetrante de cuero y maderas.",
  },
];

const OCCASIONS = [
  { id: "all", label: "Cualquier Ocasión" },
  { id: "Noche", label: "Noches & Citas" },
  { id: "Diario", label: "Uso Diario & Oficina" },
  { id: "Verano", label: "Calor & Primavera" },
  { id: "Frío", label: "Otoño & Invierno" },
];

export function OlfactoryExplorer({ products }: Props) {
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeFamilyData =
    FAMILIES_DATA.find((f) => f.id === selectedFamily) || FAMILIES_DATA[0];

  const filtered = products.filter((p) => {
    const matchFamily = selectedFamily === "all" || p.olfactory_family === selectedFamily;
    const matchOccasion =
      selectedOccasion === "all" ||
      p.occasion.toLowerCase().includes(selectedOccasion.toLowerCase()) ||
      p.season.toLowerCase().includes(selectedOccasion.toLowerCase());
    return matchFamily && matchOccasion;
  });

  const scrollDeck = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section
      id="descubrimiento"
      className="py-24 lg:py-32 bg-espresso text-porcelain border-b border-sand/15 scroll-mt-20 relative overflow-hidden grain-overlay"
    >
      {/* Dynamic Background Atmosphere Glow driven by Active Family */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none transition-all duration-1000 opacity-20"
        style={{ backgroundColor: activeFamilyData.accentColor }}
      />

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Header Introduction */}
        <RevealOnScroll direction="up" delayMs={40}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand/10 border border-champagne/35 text-champagne text-xs font-medium mb-3 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-champagne" />
                <span className="font-editorial text-xs italic">Santuario Olfativo A&D</span>
              </div>
              <h2 className="heading-section text-porcelain font-editorial">
                Arquitectura de Notas & Familias
              </h2>
              <p className="text-xs sm:text-sm text-sand/80 mt-2 font-light leading-relaxed">
                Selecciona una familia aromática para sintonizar el ambiente visual y descubrir las creaciones que comparten su química y acordes dominantes.
              </p>
            </div>

            {/* Occasion / Season Sub-Filter */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-luxury text-sand/60 font-semibold block">
                Filtrar por Momento:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {OCCASIONS.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => setSelectedOccasion(occ.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedOccasion === occ.id
                        ? "bg-sand/20 text-champagne border border-champagne/50 shadow-sm"
                        : "bg-sand/5 text-sand/70 border border-sand/15 hover:text-porcelain"
                    }`}
                  >
                    {occ.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* 1. Visually Interactive Olfactory Carousel / Card Deck (Replaces generic pill row) */}
        <div className="relative mb-12">
          
          {/* Deck Controls */}
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-[11px] uppercase tracking-luxury text-champagne font-semibold flex items-center gap-2">
              <span>Familias Aromáticas</span>
              <span className="text-sand/40">•</span>
              <span className="text-sand/70 font-normal">Navega con flechas o desliza</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollDeck("left")}
                className="w-8 h-8 rounded-full bg-sand/10 hover:bg-sand/25 border border-sand/20 flex items-center justify-center text-sand transition-colors"
                aria-label="Familia anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollDeck("right")}
                className="w-8 h-8 rounded-full bg-sand/10 hover:bg-sand/25 border border-sand/20 flex items-center justify-center text-sand transition-colors"
                aria-label="Siguiente familia"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Card Rail */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none"
            role="tablist"
            aria-label="Familias olfativas"
          >
            {FAMILIES_DATA.map((family) => {
              const isSelected = selectedFamily === family.id;
              const Icon = family.icon;

              return (
                <button
                  key={family.id}
                  onClick={() => setSelectedFamily(family.id)}
                  role="tab"
                  aria-selected={isSelected}
                  className={`group flex-shrink-0 w-64 sm:w-72 p-5 rounded-cowboy border text-left transition-all duration-400 snap-start flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? "bg-espresso-card border-champagne shadow-2xl scale-[1.02] ring-1 ring-champagne/40"
                      : "bg-espresso/60 border-sand/15 hover:border-sand/40 hover:bg-espresso/80"
                  }`}
                >
                  {/* Background Aura */}
                  <div
                    className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-opacity duration-500"
                    style={{
                      backgroundColor: family.accentColor,
                      opacity: isSelected ? 0.25 : 0.08,
                    }}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center border transition-all"
                        style={{
                          borderColor: isSelected ? family.accentColor : "rgba(232, 224, 213, 0.2)",
                          backgroundColor: isSelected ? "rgba(204, 167, 39, 0.15)" : "transparent",
                          color: isSelected ? family.accentColor : "#E8E0D5",
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {isSelected && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-champagne bg-champagne/15 px-2.5 py-0.5 rounded-full border border-champagne/30">
                          Activa
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] uppercase tracking-luxury text-sand/60 font-semibold">
                      {family.archetype}
                    </p>
                    <h3 className="font-editorial text-xl font-normal text-porcelain mt-0.5">
                      {family.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-sand/15">
                    <p className="text-[11px] text-sand/75 line-clamp-2 font-light">
                      {family.dominantNotes}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Active Family Spotlight Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-cowboy bg-espresso-card/90 border border-sand/20 backdrop-blur-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeFamilyData.accentColor }} />
                <span className="text-[10px] uppercase tracking-luxury font-bold text-champagne">
                  {activeFamilyData.archetype}
                </span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl text-porcelain font-normal">
                {activeFamilyData.name}
              </h3>
              <p className="text-xs sm:text-sm text-sand/80 font-light leading-relaxed">
                {activeFamilyData.description}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs border-t lg:border-t-0 lg:border-l border-sand/15 pt-4 lg:pt-0 lg:pl-8">
              <div>
                <span className="text-[10px] uppercase text-sand/60 block font-semibold">Fragancias Encontradas</span>
                <span className="text-xl font-bold text-champagne">{filtered.length}</span>
              </div>
              <Link
                href={`/perfumes?family=${encodeURIComponent(selectedFamily)}`}
                className="btn-gold py-2.5 px-5 text-xs flex items-center gap-2 shadow-lg"
              >
                <span>Ver en Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Live Fragrance Results Grid with Smooth Transitions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-sand/5 rounded-cowboy p-16 text-center border border-sand/15 backdrop-blur-md">
              <Droplet className="w-8 h-8 text-champagne mx-auto mb-3" />
              <h3 className="font-editorial text-2xl text-porcelain font-normal mb-1">
                Sin coincidencias para esta combinación
              </h3>
              <p className="text-xs text-sand/70 mb-5 font-light">
                Prueba restableciendo los momentos de uso para ver todas las fragancias de la familia {activeFamilyData.name}.
              </p>
              <button
                onClick={() => {
                  setSelectedFamily("all");
                  setSelectedOccasion("all");
                }}
                className="btn-gold text-xs"
              >
                Restablecer Explorador Olfativo
              </button>
            </div>
          ) : (
            filtered.map((prod, idx) => {
              const minPrice = Math.min(...prod.variants.map((v) => v.price));
              const bottleVariant = prod.variants.find((v) => v.size_ml >= 50);

              return (
                <RevealOnScroll key={prod.id} direction="up" delayMs={idx * 40} className="h-full">
                  <GlassTiltCard className="h-full bg-espresso-card/70 border border-sand/15 hover:border-champagne/60 rounded-cowboy overflow-hidden transition-all duration-500 flex flex-col justify-between group shadow-lg">
                    <div>
                      {/* Image Thumbnail */}
                      <Link
                        href={`/perfumes/${prod.id}`}
                        className="block aspect-[4/5] bg-sand/10 relative overflow-hidden glass-sheen"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.primary_image}
                          alt={prod.name}
                          className="w-full h-full object-cover transition-transform duration-900 ease-out group-hover:scale-108"
                        />

                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-espresso/90 text-champagne text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-champagne/30">
                            {prod.concentration}
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3 z-10">
                          <span className="bg-espresso/80 text-sand text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md border border-sand/20">
                            {prod.gender}
                          </span>
                        </div>
                      </Link>

                      {/* Fragrance Metadata */}
                      <div className="p-5 space-y-3">
                        <div>
                          <p className="text-[10px] uppercase font-semibold tracking-luxury text-taupe">
                            {prod.brand_name}
                          </p>
                          <Link href={`/perfumes/${prod.id}`}>
                            <h4 className="font-editorial text-xl font-normal text-porcelain group-hover:text-champagne transition-colors mt-0.5">
                              {prod.name}
                            </h4>
                          </Link>
                        </div>

                        <p className="text-xs text-sand/75 line-clamp-2 font-light">
                          {prod.short_description}
                        </p>

                        {/* Top Notes Micro Strip */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {prod.top_notes.slice(0, 3).map((note, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-sand/10 text-[10px] text-sand/90"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer / Commerce Lever */}
                    <div className="p-5 pt-0 border-t border-sand/15 mt-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-sand/60 block uppercase">Decants Desde</span>
                        <span className="text-sm font-semibold text-champagne">
                          {formatPrice(minPrice)}
                        </span>
                      </div>

                      <Link
                        href={`/perfumes/${prod.id}`}
                        className="inline-flex items-center gap-1.5 text-xs text-porcelain hover:text-champagne transition-colors font-medium"
                      >
                        <span>Ver Formatos</span>
                        <ArrowRight className="w-3.5 h-3.5 text-champagne" />
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
