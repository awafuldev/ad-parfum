"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { initialCategories } from "@/lib/data/initial-data";
import { RevealOnScroll } from "@/components/ui/motion/RevealOnScroll";

export function CategoryGrid() {
  return (
    <section className="py-28 bg-sand/20 border-b border-sand/70 grain-overlay relative">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <RevealOnScroll direction="up" delayMs={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-champagne font-semibold mb-2.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Exploración de Universos Olfativos</span>
              </div>
              <h2 className="heading-section text-espresso font-editorial">
                Elige tu Camino en Fragance Stock RD
              </h2>
            </div>
            <Link
              href="/perfumes"
              className="text-xs font-semibold text-espresso hover:text-champagne-dark flex items-center gap-2 transition-colors uppercase tracking-wider group"
            >
              <span>Ver todo el inventario</span>
              <ArrowRight className="w-3.5 h-3.5 text-champagne transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </RevealOnScroll>

        {/* Responsive Grid with Editorial Composition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialCategories.map((cat, idx) => (
            <RevealOnScroll
              key={cat.id}
              direction="up"
              delayMs={idx * 70}
              className={idx === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
            >
              <Link
                href={`/perfumes?category=${cat.id}`}
                className={`group rounded-cowboy border border-sand overflow-hidden relative flex flex-col justify-end p-8 min-h-[340px] transition-all duration-700 hover:border-espresso hover:shadow-2xl glass-sheen block ${
                  idx === 0 ? "min-h-[420px]" : ""
                }`}
              >
                {/* Background Image with Deep Cinematic Gradients */}
                <div className="absolute inset-0 z-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-108 filter brightness-[0.78] contrast-[1.12]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/50 to-transparent" />
                  <div className="absolute inset-0 bg-espresso/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Text content */}
                <div className="relative z-10 space-y-2 text-porcelain">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
                    <span className="text-[10px] uppercase font-semibold tracking-luxury text-champagne">
                      Colección Fragance Stock RD
                    </span>
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-normal tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-sand/80 line-clamp-2 max-w-md font-light leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-medium text-champagne group-hover:translate-x-2 transition-transform duration-300">
                    <span>Descubrir Fragancias</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
