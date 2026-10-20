"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Flame, Droplets, Sparkles, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { RevealOnScroll } from "@/components/ui/motion/RevealOnScroll";
import { GlassTiltCard } from "@/components/ui/motion/GlassTiltCard";

export function FeaturedEditorial() {
  return (
    <section className="py-28 bg-porcelain border-b border-sand/70 grain-overlay relative">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <RevealOnScroll direction="up" delayMs={50}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-champagne font-semibold mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curaduría de Maestros Olfativos</span>
              </div>
              <h2 className="heading-section text-espresso font-editorial">
                Los Iconos de la Casa A&D
              </h2>
            </div>
            <p className="text-sm text-taupe max-w-md font-light leading-relaxed">
              Composiciones galardonadas que han transformado el panorama de la perfumería internacional con estelas imponentes y longevidades de hasta 16 horas en piel.
            </p>
          </div>
        </RevealOnScroll>

        {/* Asymmetrical 2-Column Luxury Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Main Showcase: Lattafa Khamrah */}
          <div className="lg:col-span-7 flex flex-col">
            <RevealOnScroll direction="up" delayMs={100} className="h-full flex flex-col">
              <GlassTiltCard className="h-full bg-white rounded-cowboy p-8 sm:p-12 border border-sand shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-8 items-center flex-1">
                  
                  <div className="w-full sm:w-1/2 flex-1 space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-xs font-medium text-amber-900">
                      <Flame className="w-3.5 h-3.5 text-amber-700" />
                      <span className="font-editorial text-xs italic">El Gourmand Insignia</span>
                    </div>

                    <p className="text-[10px] uppercase tracking-luxury text-taupe font-semibold">
                      Lattafa Perfumes • Dubái
                    </p>

                    <h3 className="text-3xl sm:text-4xl font-editorial font-normal text-espresso leading-tight">
                      Khamrah
                    </h3>

                    <p className="text-xs sm:text-sm text-smoke leading-relaxed font-light">
                      Canela licorosa, dátiles confitados y praliné en base de vainilla madura y resinas preciosas. Un aroma hipnótico para climas templados, noches y ocasiones memorables.
                    </p>

                    {/* Olfactory Notes Mini Pyramid */}
                    <div className="pt-2 pb-4 space-y-2 text-xs border-y border-sand/60">
                      <div className="flex items-center gap-2">
                        <span className="text-taupe font-medium w-16 text-[11px]">Salida:</span>
                        <span className="text-espresso font-medium text-[11px]">Canela, Nuez Moscada, Bergamota</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-taupe font-medium w-16 text-[11px]">Corazón:</span>
                        <span className="text-espresso font-medium text-[11px]">Dátiles de Arabia, Praliné, Nardos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-taupe font-medium w-16 text-[11px]">Fondo:</span>
                        <span className="text-espresso font-medium text-[11px]">Vainilla Bourbon, Tonka, Benjuí, Mirra</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-taupe block uppercase font-medium">Decants desde</span>
                        <span className="text-lg font-semibold text-espresso">
                          {formatPrice(35000)}
                        </span>
                      </div>
                      <Link
                        href="/perfumes/prod-khamrah"
                        className="btn-primary text-xs"
                      >
                        <span>Ver Formatos</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Image with Glass Sheen */}
                  <div className="w-full sm:w-1/2 aspect-[4/5] rounded-cowboy overflow-hidden bg-sand/20 border border-sand relative glass-sheen">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=85"
                      alt="Lattafa Khamrah en A&D Parfum"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                </div>
              </GlassTiltCard>
            </RevealOnScroll>
          </div>

          {/* Secondary Showcase: Rasasi Hawas */}
          <div className="lg:col-span-5 flex flex-col">
            <RevealOnScroll direction="up" delayMs={200} className="h-full flex flex-col">
              <GlassTiltCard className="h-full bg-espresso text-porcelain rounded-cowboy p-8 sm:p-10 border border-espresso shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group overflow-hidden">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/10 border border-champagne/30 text-xs font-medium text-sand">
                    <Droplets className="w-3.5 h-3.5 text-champagne" />
                    <span className="font-editorial text-xs italic text-champagne">Titán Acuático</span>
                  </div>

                  <p className="text-[10px] uppercase tracking-luxury text-sand/60 font-semibold">
                    Rasasi • Dubái
                  </p>

                  <h3 className="text-3xl font-editorial font-normal text-porcelain leading-tight">
                    Hawas for Him
                  </h3>

                  <p className="text-xs sm:text-sm text-sand/75 leading-relaxed font-light">
                    Manzana crujiente, ciruela madura, brisa marina y ámbar gris. La fragancia insignia para calor, universidad y diario de alto magnetismo.
                  </p>

                  <div className="aspect-[16/10] rounded-cowboy overflow-hidden bg-sand/10 border border-sand/20 my-4 relative glass-sheen">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85"
                      alt="Rasasi Hawas for Him en A&D Parfum"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-sand/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-sand/60 block uppercase font-medium">Decants desde</span>
                    <span className="text-lg font-semibold text-champagne">
                      {formatPrice(36000)}
                    </span>
                  </div>
                  <Link
                    href="/perfumes/prod-hawas"
                    className="btn-gold text-xs py-2.5 px-4"
                  >
                    <span>Descubrir Hawas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </GlassTiltCard>
            </RevealOnScroll>
          </div>

        </div>

      </div>
    </section>
  );
}
