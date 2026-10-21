"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, ShoppingBag, Check, Sparkles, Droplets, ArrowRight } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { useCart } from "@/context/CartContext";
import { GlassTiltCard } from "@/components/ui/motion/GlassTiltCard";

interface Props {
  product: Product;
  featuredSpotlight?: boolean;
}

export function EditorialProductCard({ product, featuredSpotlight = false }: Props) {
  const { addItem, openCart } = useCart();
  const availableVariants = product.variants.filter((v) => v.is_available);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    availableVariants[0] || product.variants[0]
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant || !selectedVariant.is_available) return;

    addItem(product, selectedVariant, 1);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      openCart();
    }, 600);
  };

  // SPOTLIGHT EXPANSIVE HORIZONTAL CARD
  if (featuredSpotlight) {
    return (
      <GlassTiltCard className="col-span-full rounded-cowboy border border-sand hover:border-espresso bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left / Editorial Photography */}
          <div className="lg:col-span-6 relative aspect-[16/11] lg:aspect-auto lg:h-[460px] bg-sand/15 overflow-hidden glass-sheen group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.primary_image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-900 ease-out group-hover:scale-106"
            />
            
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              <span className="bg-espresso text-champagne text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-champagne/40 shadow-md">
                Fragancia Insignia de la Casa
              </span>
            </div>

            <div className="absolute top-4 right-4 z-10">
              <span className="bg-porcelain/95 backdrop-blur-md text-taupe text-[10px] font-medium px-3 py-1 rounded-full border border-sand shadow-sm">
                {product.concentration}
              </span>
            </div>

            <Link
              href={`/perfumes/${product.id}`}
              className="absolute inset-0 bg-espresso/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            >
              <span className="btn-gold text-xs py-2.5 px-4 shadow-xl flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                <span>Explorar Ficha Completa</span>
              </span>
            </Link>
          </div>

          {/* Right / Editorial Details & Quick Commerce */}
          <div className="lg:col-span-6 p-8 sm:p-12 space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-luxury text-taupe">
                  {product.brand_name} • {product.gender}
                </span>
                <span className="text-xs text-sand/80 bg-sand/20 px-2.5 py-0.5 rounded-full border border-sand/60">
                  {product.longevity}
                </span>
              </div>

              <Link href={`/perfumes/${product.id}`}>
                <h3 className="font-editorial text-3xl sm:text-4xl text-espresso hover:text-champagne-dark transition-colors font-normal leading-tight">
                  {product.name}
                </h3>
              </Link>

              <p className="text-sm text-smoke font-light leading-relaxed">
                {product.description || product.short_description}
              </p>

              {/* Notes Pyramid Mini Accordion */}
              <div className="p-4 rounded-cowboy bg-sand/15 border border-sand/60 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-taupe font-medium w-16 text-[11px]">Salida:</span>
                  <span className="text-espresso font-medium text-[11px] line-clamp-1">{product.top_notes.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-taupe font-medium w-16 text-[11px]">Corazón:</span>
                  <span className="text-espresso font-medium text-[11px] line-clamp-1">{product.heart_notes.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-taupe font-medium w-16 text-[11px]">Fondo:</span>
                  <span className="text-espresso font-medium text-[11px] line-clamp-1">{product.base_notes.join(", ")}</span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] uppercase font-semibold tracking-luxury text-taupe block">
                  Seleccionar Formato:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        disabled={!v.is_available}
                        className={`px-3.5 py-1.5 rounded-full text-xs transition-all duration-300 flex items-center gap-1.5 ${
                          !v.is_available
                            ? "opacity-40 cursor-not-allowed bg-sand/20 border border-sand"
                            : isSelected
                            ? "bg-espresso text-champagne font-semibold border border-espresso shadow-md scale-105"
                            : "bg-white text-espresso border border-sand hover:border-espresso"
                        }`}
                      >
                        <span>{v.name}</span>
                        {!v.is_available && <span className="text-[9px] text-red-500">(Agotado)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Price & Add to Cart Action */}
            <div className="pt-6 border-t border-sand/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-taupe block uppercase font-medium">Precio Formato Seleccionado</span>
                <span className="text-2xl font-semibold text-espresso">
                  {formatPrice(selectedVariant.price)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/perfumes/${product.id}`}
                  className="btn-secondary text-xs py-3 px-5"
                >
                  <span>Ver Detalles</span>
                </Link>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant.is_available}
                  className={`btn-gold text-xs py-3 px-6 flex items-center justify-center gap-2 ${
                    addedAnimation ? "bg-emerald-600 text-white border-emerald-600" : ""
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Añadido a la Bolsa!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Añadir a la Bolsa</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
      </GlassTiltCard>
    );
  }

  // STANDARD HIGH-END EDITORIAL CARD
  return (
    <GlassTiltCard className="h-full group rounded-cowboy border border-sand hover:border-espresso bg-white flex flex-col justify-between transition-all duration-500 overflow-hidden hover:shadow-xl">
      <div>
        {/* Photographic Stage */}
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

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.is_bestseller && (
              <span className="bg-espresso text-champagne text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-champagne/40 shadow-sm">
                Bestseller
              </span>
            )}
            {product.featured && (
              <span className="bg-porcelain border border-sand text-espresso text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                Destacado
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span className="bg-porcelain/95 backdrop-blur-sm text-taupe text-[9px] font-medium px-2 py-0.5 rounded-full border border-sand shadow-sm">
              {product.concentration}
            </span>
          </div>

          {/* Quick Hover Inspect */}
          <div className="absolute inset-0 bg-espresso/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <span className="btn-gold text-xs py-2 px-3.5 shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Ficha</span>
            </span>
          </div>
        </Link>

        {/* Metadata */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] uppercase font-semibold tracking-luxury text-taupe">
              {product.brand_name}
            </p>
            <span className="text-[10px] text-taupe font-medium">
              {product.gender}
            </span>
          </div>

          <Link href={`/perfumes/${product.id}`}>
            <h3 className="font-editorial text-xl font-normal text-espresso line-clamp-1 mb-1.5 group-hover:text-champagne-dark transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-smoke line-clamp-2 mb-3 leading-relaxed font-light">
            {product.short_description}
          </p>

          {/* Notes pills */}
          <div className="flex flex-wrap gap-1 text-[10px] text-graphite mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-sand/30 border border-sand/70">
              {product.olfactory_family}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sand/30 border border-sand/70 text-taupe">
              {product.longevity}
            </span>
          </div>

          {/* Quick Variant Pills */}
          <div className="pt-2 border-t border-sand/60">
            <div className="flex items-center justify-between text-[10px] text-taupe mb-1.5 font-medium">
              <span>Presentación:</span>
              <span className="font-semibold text-espresso">{selectedVariant.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-sand/15 p-1 rounded-lg border border-sand/60">
              {product.variants.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedVariant(v);
                    }}
                    disabled={!v.is_available}
                    className={`py-1.5 px-1 rounded-md text-center transition-all ${
                      !v.is_available
                        ? "opacity-35 cursor-not-allowed text-taupe"
                        : isSelected
                        ? "bg-espresso text-white font-bold shadow-xs"
                        : "bg-white text-espresso hover:bg-sand/30 font-medium"
                    }`}
                  >
                    <span className="block text-[11px] leading-tight font-bold">{v.size_ml} ml</span>
                    <span className={`block text-[9px] ${isSelected ? "text-white/80" : "text-taupe"}`}>{formatPrice(v.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Live Selected Price & Add Action */}
      <div className="px-5 pb-5 pt-3 border-t border-sand/60 flex items-center justify-between gap-3 mt-auto">
        <div>
          <span className="text-[10px] text-taupe block uppercase font-medium">Total Formato</span>
          <span className="text-lg font-bold text-espresso">
            {formatPrice(selectedVariant.price)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedVariant.is_available}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            addedAnimation
              ? "bg-emerald-700 text-white border-emerald-700"
              : selectedVariant.is_available
              ? "bg-noir text-white hover:bg-wine active:scale-98"
              : "bg-gray/20 text-gray cursor-not-allowed"
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-3.5 h-3.5 animate-in zoom-in" />
              <span>¡Añadido!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Añadir a Bolsa</span>
            </>
          )}
        </button>
      </div>
    </GlassTiltCard>
  );
}
