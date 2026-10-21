"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, ShoppingBag, Check, Droplet, ArrowRight, Flame } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { useCart } from "@/context/CartContext";

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

  // 1. SPOTLIGHT EXPANSIVE HORIZONTAL EDITORIAL CARD
  if (featuredSpotlight) {
    return (
      <article className="col-span-full rounded-2xl border border-border/90 hover:border-noir bg-white overflow-hidden shadow-2xs hover:shadow-2xl transition-all duration-500 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left / Editorial Photography Stage */}
          <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto lg:h-[480px] bg-gradient-to-b from-[#FBFBF9] via-[#FAF9F5] to-[#F2EFE9] border-b lg:border-b-0 lg:border-r border-border/70 flex items-center justify-center p-8 sm:p-12 group/stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.primary_image}
              alt={`${product.name} — ${product.brand_name}`}
              className="max-w-full max-h-[85%] w-auto h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)] transition-transform duration-900 ease-out group-hover/stage:scale-105"
            />
            
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              <span className="bg-noir text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 shadow-md">
                Fragancia Insignia de la Casa
              </span>
            </div>

            <div className="absolute top-4 right-4 z-10">
              <span className="bg-white/95 backdrop-blur-md text-noir text-[11px] font-semibold px-3 py-1 rounded-full border border-border shadow-xs">
                {product.concentration}
              </span>
            </div>

            <Link
              href={`/perfumes/${product.id}`}
              className="absolute inset-0 bg-noir/20 opacity-0 group-hover/stage:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            >
              <span className="bg-white text-noir hover:bg-wine hover:text-white text-xs font-semibold py-3 px-5 rounded-full shadow-2xl flex items-center gap-2 transition-colors">
                <Eye className="w-3.5 h-3.5" />
                <span>Explorar Ficha Completa</span>
              </span>
            </Link>
          </div>

          {/* Right / Editorial Details & Commerce */}
          <div className="lg:col-span-6 p-8 sm:p-12 space-y-6 flex flex-col justify-between h-full bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-luxury text-gray">
                <span>{product.brand_name} • {product.gender}</span>
                <span className="text-xs text-noir font-medium bg-ivory px-3 py-1 rounded-full border border-border">
                  {product.longevity}
                </span>
              </div>

              <Link href={`/perfumes/${product.id}`}>
                <h3 className="font-editorial text-3xl sm:text-4xl text-noir hover:text-wine transition-colors font-normal leading-tight">
                  {product.name}
                </h3>
              </Link>

              <p className="text-sm text-gray font-light leading-relaxed">
                {product.description || product.short_description}
              </p>

              {/* Notes Pyramid Mini Accordion */}
              <div className="p-4 rounded-xl bg-ivory border border-border space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray font-semibold w-16 text-[11px] uppercase tracking-wider">Salida:</span>
                  <span className="text-noir font-medium text-[11px] line-clamp-1">{product.top_notes.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray font-semibold w-16 text-[11px] uppercase tracking-wider">Corazón:</span>
                  <span className="text-noir font-medium text-[11px] line-clamp-1">{product.heart_notes.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray font-semibold w-16 text-[11px] uppercase tracking-wider">Fondo:</span>
                  <span className="text-noir font-medium text-[11px] line-clamp-1">{product.base_notes.join(", ")}</span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-luxury text-gray">
                  <span>Seleccionar Formato:</span>
                  <span className="text-noir font-semibold">{selectedVariant.name}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        disabled={!v.is_available}
                        className={`px-4 py-2 rounded-full text-xs transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                          !v.is_available
                            ? "opacity-35 cursor-not-allowed bg-border/20 border border-border text-gray"
                            : isSelected
                            ? "bg-noir text-white font-bold border border-noir shadow-sm"
                            : "bg-white text-noir border border-border hover:border-noir/40 font-medium"
                        }`}
                      >
                        <span>{v.size_ml} ml</span>
                        <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-gray"}`}>
                          ({formatPrice(v.price)})
                        </span>
                        {!v.is_available && <span className="text-[9px] text-red-500">(Agotado)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Price & Add to Cart Action */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-shrink-0 flex items-center">
                <span className="font-price text-2xl sm:text-3xl font-bold text-noir tracking-tight leading-none">
                  {formatPrice(selectedVariant.price)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/perfumes/${product.id}`}
                  className="h-11 px-5 rounded-full border border-border text-xs font-semibold text-noir hover:bg-ivory hover:border-noir transition-colors flex items-center justify-center"
                >
                  <span>Ver Detalles</span>
                </Link>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant.is_available}
                  className={`h-11 px-7 rounded-full text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    addedAnimation
                      ? "bg-emerald-600 text-white"
                      : "bg-noir text-white hover:bg-wine active:scale-98"
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
      </article>
    );
  }

  // 2. STANDARD HIGH-END EDITORIAL CARD
  return (
    <article className="h-full group bg-white rounded-2xl border border-border/90 hover:border-noir flex flex-col justify-between transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-xl">
      <div>
        {/* Photographic Stage */}
        <Link
          href={`/perfumes/${product.id}`}
          className="block aspect-[4/5] bg-gradient-to-b from-[#FBFBF9] via-[#FAF9F5] to-[#F2EFE9] border-b border-border/70 relative overflow-hidden flex items-center justify-center p-6 group/stage"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.primary_image}
            alt={`${product.name} — ${product.brand_name}`}
            className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.09)] transition-transform duration-700 ease-out group-hover/stage:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.is_bestseller && (
              <span className="bg-wine text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 w-fit">
                <Flame className="w-3 h-3" />
                <span>Bestseller</span>
              </span>
            )}
            {product.featured && (
              <span className="bg-noir text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                Destacado
              </span>
            )}
          </div>

          <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
            <span className="bg-white/95 backdrop-blur-md text-noir text-[10px] font-semibold px-2.5 py-1 rounded-full border border-border shadow-2xs">
              {product.concentration}
            </span>
          </div>

          {/* Quick Hover Inspect */}
          <div className="absolute inset-0 bg-noir/20 opacity-0 group-hover/stage:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <span className="bg-white text-noir hover:bg-wine hover:text-white text-xs font-semibold py-2.5 px-4 rounded-full shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover/stage:translate-y-0 transition-all duration-300">
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Ficha</span>
            </span>
          </div>
        </Link>

        {/* Metadata */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-luxury text-gray">
            <span>{product.brand_name}</span>
            <span className="text-[10px] bg-ivory px-2 py-0.5 rounded-full border border-border text-noir/70 font-semibold">
              {product.gender}
            </span>
          </div>

          <Link href={`/perfumes/${product.id}`}>
            <h3 className="font-editorial text-2xl font-normal text-noir line-clamp-1 group-hover:text-wine transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11.5px] text-gray line-clamp-2 leading-relaxed font-light">
            {product.short_description}
          </p>

          {/* Olfactory Notes pills */}
          <div className="flex flex-wrap gap-1 text-[11px] text-gray pt-1">
            <span className="inline-flex items-center gap-1 bg-ivory px-2.5 py-1 rounded-full border border-border">
              <Droplet className="w-3 h-3 text-wine" />
              <span>{product.olfactory_family}</span>
            </span>
          </div>

          {/* Quick Variant Selector */}
          <div className="pt-2 border-t border-border/80">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-luxury text-gray mb-1.5">
              <span>Presentación:</span>
              <span className="text-noir font-semibold">{selectedVariant.size_ml} ml</span>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-ivory p-1 rounded-xl border border-border">
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
                    className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer ${
                      !v.is_available
                        ? "opacity-35 cursor-not-allowed text-gray"
                        : isSelected
                        ? "bg-noir text-white font-bold shadow-xs"
                        : "bg-white text-noir hover:bg-border/40 font-medium"
                    }`}
                  >
                    <span className="block text-[11px] leading-tight font-bold">{v.size_ml} ml</span>
                    <span className={`block text-[9.5px] ${isSelected ? "text-white/80" : "text-gray"}`}>
                      {formatPrice(v.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Live Selected Price & Add Action */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-border flex items-center justify-between gap-3 mt-auto">
        <div className="flex-shrink-0 flex items-center">
          <span className="font-price text-xl sm:text-2xl font-bold text-noir leading-none tracking-tight">
            {formatPrice(selectedVariant.price)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedVariant.is_available}
          className={`flex-1 h-11 px-4 rounded-full text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
            addedAnimation
              ? "bg-emerald-600 text-white"
              : selectedVariant.is_available
              ? "bg-noir text-white hover:bg-wine active:scale-98"
              : "bg-gray/20 text-gray cursor-not-allowed"
          }`}
          aria-label={`Añadir ${product.name} a la bolsa`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>¡Añadido!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
