"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { initialBrands } from "@/lib/data/initial-data";
import { RevealOnScroll } from "@/components/ui/motion/RevealOnScroll";
import { GlassTiltCard } from "@/components/ui/motion/GlassTiltCard";

export function BrandStrip() {
  return (
    <section id="marcas" className="py-28 bg-porcelain border-b border-sand/70 scroll-mt-20 grain-overlay relative">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        <RevealOnScroll direction="up" delayMs={50}>
          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-champagne font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Casas de Prestigio</span>
            </div>
            <h2 className="heading-section text-espresso font-editorial">
              Los Grandes Nombres de Medio Oriente
            </h2>
            <p className="text-xs sm:text-sm text-taupe mt-2 font-light">
              Perfiles olfativos certificados elaborados con aceites finos y alta concentración para Fragance Stock RD.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {initialBrands.map((brand, idx) => (
            <RevealOnScroll
              key={brand.id}
              direction="up"
              delayMs={idx * 60}
              className="h-full"
            >
              <GlassTiltCard className="h-full p-6 rounded-cowboy border border-sand hover:border-espresso bg-white hover:bg-sand/10 text-center transition-all duration-400 flex flex-col justify-between group shadow-sm hover:shadow-xl">
                <Link href={`/perfumes?brand=${brand.id}`} className="block h-full flex flex-col justify-between">
                  <div>
                    <span className="block font-editorial text-xl font-normal text-espresso group-hover:text-champagne-dark transition-colors">
                      {brand.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-taupe mt-1 block">
                      {brand.origin}
                    </span>
                  </div>
                  <p className="text-[11px] text-smoke line-clamp-2 mt-4 leading-relaxed font-light">
                    {brand.description}
                  </p>
                </Link>
              </GlassTiltCard>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
