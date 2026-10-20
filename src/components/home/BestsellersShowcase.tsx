"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Sparkles, Droplets, Check, Plus, ShoppingBag } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { RevealOnScroll } from "@/components/ui/motion/RevealOnScroll";
import { GlassTiltCard } from "@/components/ui/motion/GlassTiltCard";
import { useCart } from "@/context/CartContext";

interface Props {
  products: Product[];
}

export function BestsellersShowcase({ products }: Props) {
  const { addItem, openCart } = useCart();
  const displayProducts = products.filter((p) => p.featured || p.is_bestseller);
  const [addedId, setAddedId] = useState<string | null>(null);

  const heroProduct = displayProducts[0] || products[0];
  const secondaryProducts = displayProducts.slice(1, 7);

  const handleQuickAdd = (product: Product, variant: ProductVariant, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, variant, 1);
    setAddedId(variant.id);
    setTimeout(() => {
      setAddedId(null);
      openCart();
    }, 600);
  };

  return (
    <section className="py-24 lg:py-32 bg-porcelain border-b border-sand/70 grain-overlay relative">
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Editorial Section Header */}
        <RevealOnScroll direction="up" delayMs={40}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-champagne font-semibold mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curaduría de la Casa</span>
              </div>
              <h2 className="heading-section text-espresso font-editorial">
                Iconos & Bestsellers de Colección
              </h2>
              <p className="text-xs sm:text-sm text-taupe mt-2 font-light leading-relaxed">
                Obras maestras de Oriente y alta perfumería con fijaciones insuperables. Disponibles en frascos sellados o en atomizadores fraccionados de 5&nbsp;ml y 10&nbsp;ml.
              </p>
            </div>

            <Link
              href="/perfumes"
              className="btn-secondary text-xs group py-3 px-6 whitespace-nowrap self-start md:self-auto"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </RevealOnScroll>

        {/* 1. FEATURED ICON MASTERPIECE (Asymmetric Hero Banner) */}
        {heroProduct && (
          <RevealOnScroll direction="fade" delayMs={60} className="mb-14">
            <GlassTiltCard className="rounded-cowboy border border-sand bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                
                {/* Large Editorial Photograph (Dominant Scale) */}
                <div className="lg:col-span-7 relative aspect-[16/11] lg:aspect-auto lg:h-[480px] bg-sand/15 overflow-hidden glass-sheen">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroProduct.primary_image}
                    alt={heroProduct.name}
                    className="w-full h-full object-cover transition-transform duration-900 ease-out group-hover:scale-106"
                  />

                  <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                    <span className="bg-espresso text-champagne text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-champagne/40 shadow-lg">
                      Fragancia Insignia
                    </span>
                    <span className="bg-porcelain/95 text-espresso text-[10px] font-medium px-3 py-0.5 rounded-full border border-sand shadow-sm self-start">
                      {heroProduct.concentration}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 z-10">
                    <span className="bg-espresso/80 backdrop-blur-md text-sand text-[11px] px-3 py-1 rounded-full border border-sand/20">
                      {heroProduct.gender} • {heroProduct.longevity}
                    </span>
                  </div>
                </div>

                {/* Editorial Narrative & Quick Selection */}
                <div className="lg:col-span-5 p-8 sm:p-12 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-sand/60 pb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-luxury text-taupe">
                        {heroProduct.brand_name}
                      </span>
                      <span className="text-xs text-champagne-dark font-medium">
                        {heroProduct.olfactory_family}
                      </span>
                    </div>

                    <Link href={`/perfumes/${heroProduct.id}`}>
                      <h3 className="font-editorial text-3xl sm:text-4xl text-espresso hover:text-champagne-dark transition-colors font-normal leading-tight">
                        {heroProduct.name}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-smoke font-light leading-relaxed">
                      {heroProduct.short_description}
                    </p>

                    {/* Notes Pyramid Strip */}
                    <div className="p-3.5 rounded-cowboy bg-sand/15 border border-sand/60 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-taupe font-medium w-14 text-[11px]">Salida:</span>
                        <span className="text-espresso font-medium text-[11px] truncate">
                          {heroProduct.top_notes.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-taupe font-medium w-14 text-[11px]">Fondo:</span>
                        <span className="text-espresso font-medium text-[11px] truncate">
                          {heroProduct.base_notes.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Quick Variant Availability */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] uppercase font-semibold tracking-luxury text-taupe block">
                        Formatos Disponibles:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {heroProduct.variants.map((v) => (
                          <button
                            key={v.id}
                            onClick={(e) => handleQuickAdd(heroProduct, v, e)}
                            className="px-3 py-1.5 rounded-full text-xs border border-sand bg-white hover:border-espresso hover:bg-sand/10 transition-all flex items-center gap-2 group/btn"
                            title={`Agregar ${v.name} a la bolsa`}
                          >
                            <span className="font-medium text-espresso">{v.name}</span>
                            <span className="text-champagne font-semibold">{formatPrice(v.price)}</span>
                            {addedId === v.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Plus className="w-3 h-3 text-taupe group-hover/btn:text-espresso" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-sand/70 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-taupe uppercase block">Decants Desde</span>
                      <span className="text-xl font-bold text-espresso">
                        {formatPrice(Math.min(...heroProduct.variants.map((v) => v.price)))}
                      </span>
                    </div>

                    <Link
                      href={`/perfumes/${heroProduct.id}`}
                      className="btn-gold py-3 px-6 text-xs flex items-center gap-2 shadow-lg"
                    >
                      <span>Ficha Completa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>
            </GlassTiltCard>
          </RevealOnScroll>
        )}

        {/* 2. ASYMMETRIC SECONDARY SHOWCASE (Variable Scales & Ratios) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {secondaryProducts.map((product, idx) => {
            const minPrice = Math.min(...product.variants.map((v) => v.price));
            const defaultDecant = product.variants.find((v) => v.size_ml === 10) || product.variants[0];

            return (
              <RevealOnScroll
                key={product.id}
                direction="up"
                delayMs={idx * 60}
                className="h-full flex flex-col"
              >
                <GlassTiltCard className="h-full bg-white rounded-cowboy border border-sand hover:border-espresso transition-all duration-500 overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl">
                  <div>
                    {/* Variable Aspect Ratio based on position */}
                    <Link
                      href={`/perfumes/${product.id}`}
                      className={`block bg-sand/15 relative overflow-hidden glass-sheen ${
                        idx % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/5]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.primary_image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-900 ease-out group-hover:scale-108"
                      />

                      {/* Floating Badges */}
                      <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                        {product.is_bestseller && (
                          <span className="bg-espresso text-champagne text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-champagne/40 shadow-sm">
                            Bestseller
                          </span>
                        )}
                        <span className="bg-porcelain/95 text-espresso text-[9px] font-medium px-2.5 py-0.5 rounded-full border border-sand shadow-sm self-start">
                          {product.concentration}
                        </span>
                      </div>

                      <div className="absolute top-3.5 right-3.5 z-10">
                        <span className="bg-porcelain/90 backdrop-blur-sm text-taupe text-[10px] px-2.5 py-0.5 rounded-full border border-sand">
                          {product.gender}
                        </span>
                      </div>

                      {/* Hover Overlay Action */}
                      <div className="absolute inset-0 bg-espresso/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                        <span className="btn-gold text-xs py-2.5 px-4 shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Explorar Ficha</span>
                        </span>
                      </div>
                    </Link>

                    {/* Product Metadata */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-luxury text-taupe font-semibold">
                        <span>{product.brand_name}</span>
                        <span className="text-champagne-dark font-medium">{product.olfactory_family}</span>
                      </div>

                      <Link href={`/perfumes/${product.id}`}>
                        <h4 className="font-editorial text-2xl font-normal text-espresso hover:text-champagne-dark transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                      </Link>

                      <p className="text-xs text-smoke font-light line-clamp-2 leading-relaxed">
                        {product.short_description}
                      </p>

                      {/* Notes Mini Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {product.top_notes.slice(0, 2).map((n, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-sand/20 text-[10px] text-graphite">
                            {n}
                          </span>
                        ))}
                        <span className="px-2 py-0.5 rounded bg-sand/20 text-[10px] text-taupe">
                          +{product.base_notes.length} notas
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Commerce Action Strip */}
                  <div className="p-6 pt-0 border-t border-sand/60 mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-taupe uppercase block">Desde</span>
                      <span className="text-base font-bold text-espresso">
                        {formatPrice(minPrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleQuickAdd(product, defaultDecant, e)}
                        className="p-2.5 rounded-full border border-sand hover:border-espresso hover:bg-sand/20 text-espresso transition-colors"
                        title={`Agregar ${defaultDecant.name}`}
                        aria-label="Agregar muestra a la bolsa"
                      >
                        {addedId === defaultDecant.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                      </button>

                      <Link
                        href={`/perfumes/${product.id}`}
                        className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
                      >
                        <span>Detalles</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
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
