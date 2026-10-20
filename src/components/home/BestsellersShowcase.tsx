"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Eye, Sparkles, Droplet } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { RevealOnScroll } from "@/components/ui/motion/RevealOnScroll";
import { GlassTiltCard } from "@/components/ui/motion/GlassTiltCard";

interface Props {
  products: Product[];
}

export function BestsellersShowcase({ products }: Props) {
  const displayProducts = products.filter((p) => p.featured || p.is_bestseller).slice(0, 6);

  return (
    <section className="py-28 bg-porcelain border-b border-sand/70 grain-overlay relative">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <RevealOnScroll direction="up" delayMs={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-champagne font-semibold mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Selección de la Casa</span>
              </div>
              <h2 className="heading-section text-espresso font-editorial">
                Fragancias Seleccionadas
              </h2>
            </div>

            <Link
              href="/perfumes"
              className="btn-secondary text-xs group"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </RevealOnScroll>

        {/* Dynamic Editorial Layout: Asymmetric First Showcase + Staggered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product, index) => {
            const minPrice = Math.min(...product.variants.map((v) => v.price));
            const availableVariants = product.variants.filter((v) => v.is_available);

            return (
              <RevealOnScroll
                key={product.id}
                direction="up"
                delayMs={80 * (index % 3)}
                className="h-full"
              >
                <GlassTiltCard className="h-full group rounded-cowboy border border-sand hover:border-espresso bg-white flex flex-col justify-between transition-all duration-500 overflow-hidden hover:shadow-xl">
                  <div>
                    {/* Image Container with Badges */}
                    <Link
                      href={`/perfumes/${product.id}`}
                      className="block aspect-[4/5] bg-sand/15 relative overflow-hidden glass-sheen"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.primary_image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-900 ease-out group-hover:scale-108"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                        {product.is_bestseller && (
                          <span className="bg-espresso text-champagne text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-champagne/40 shadow-sm">
                            Bestseller
                          </span>
                        )}
                        {product.is_new && (
                          <span className="bg-porcelain border border-sand text-espresso text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                            Nuevo Ingreso
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3.5 right-3.5 z-10">
                        <span className="bg-porcelain/95 backdrop-blur-sm text-taupe text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-sand shadow-sm">
                          {product.concentration}
                        </span>
                      </div>

                      {/* Subtle Hover Action Overlay */}
                      <div className="absolute inset-0 bg-espresso/30 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center p-4">
                        <span className="btn-gold text-xs py-2.5 px-4 shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Ficha & Notas</span>
                        </span>
                      </div>
                    </Link>

                    {/* Body Info */}
                    <div className="p-6">
                      <p className="text-[10px] font-semibold uppercase tracking-luxury text-taupe mb-1">
                        {product.brand_name}
                      </p>

                      <Link href={`/perfumes/${product.id}`}>
                        <h3 className="font-editorial text-2xl font-normal text-espresso line-clamp-1 mb-2 group-hover:text-champagne-dark transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-smoke line-clamp-2 mb-4 leading-relaxed font-light">
                        {product.short_description}
                      </p>

                      {/* Olfactory Notes Pill */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sand/30 text-graphite border border-sand/70">
                          {product.olfactory_family}
                        </span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sand/20 text-taupe border border-sand/50">
                          {product.gender}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className="p-6 pt-0 border-t border-sand/60 mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-taupe block uppercase font-medium">Decants desde</span>
                      <span className="text-lg font-semibold text-espresso">
                        {formatPrice(minPrice)}
                      </span>
                    </div>

                    <Link
                      href={`/perfumes/${product.id}`}
                      className="btn-primary text-xs py-2 px-3.5"
                    >
                      <span>{availableVariants.length} Formatos</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </GlassTiltCard>
              </RevealOnScroll>
            );
          })}
        </div>

      </div>
    </section>
  );
}
