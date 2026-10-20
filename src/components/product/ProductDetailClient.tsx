"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Plus,
  Minus,
  Check,
  Share2,
  ZoomIn,
  X,
  Droplet,
  Clock,
  Wind,
  Layers,
  ChevronDown,
  ArrowRight,
  Flame,
  Award,
  Calendar,
} from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";
import { GlassTiltCard } from "@/components/ui/motion/GlassTiltCard";
import { RevealOnScroll } from "@/components/ui/motion/RevealOnScroll";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const { addItem, openCart } = useCart();

  // Active variant state (defaults to 10ml or first available)
  const defaultVariant =
    product.variants.find((v) => v.is_available && v.size_ml === 10) ||
    product.variants.find((v) => v.is_available) ||
    product.variants[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>("pyramid");

  const images = product.images.length > 0 ? product.images : [product.primary_image];
  const activeImage = images[selectedImageIndex] || product.primary_image;

  const handleAddToCart = () => {
    if (!selectedVariant.is_available || selectedVariant.stock <= 0) return;
    const ok = addItem(product, selectedVariant, quantity);
    if (ok) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
      openCart();
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="py-10 lg:py-16 bg-porcelain">
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Navegación de migas de pan" className="flex items-center gap-2 text-xs text-taupe mb-8">
          <Link href="/" className="hover:text-espresso transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/perfumes" className="hover:text-espresso transition-colors">
            Perfumes
          </Link>
          <span>/</span>
          <span className="text-graphite">{product.brand_name}</span>
          <span>/</span>
          <span className="text-espresso font-medium truncate max-w-[220px]">
            {product.name}
          </span>
        </nav>

        {/* 2-Column Luxury Stage Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Large Sophisticated Gallery with Smooth Crossfade & Zoom */}
          <div className="lg:col-span-7 space-y-5 lg:sticky lg:top-28">
            
            {/* Main Stage Image with Perspective & Sheen */}
            <div className="relative aspect-[4/5] rounded-cowboy overflow-hidden bg-white border border-sand shadow-sm hover:shadow-2xl transition-all duration-700 glass-sheen group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={`${product.name} - Imagen Principal`}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />

              {/* Status Badges */}
              <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                {product.is_bestseller && (
                  <span className="bg-espresso text-champagne text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-champagne/40 shadow-md">
                    Bestseller
                  </span>
                )}
                <span className="bg-porcelain/95 text-espresso text-[10px] font-medium px-3.5 py-0.5 rounded-full border border-sand shadow-sm self-start">
                  {product.concentration}
                </span>
              </div>

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setZoomModalOpen(true)}
                className="absolute bottom-5 right-5 bg-porcelain/90 backdrop-blur-md p-3.5 rounded-full border border-sand text-espresso hover:bg-white shadow-xl transition-all hover:scale-110 z-10"
                title="Ampliar fotografía a pantalla completa"
                aria-label="Ampliar imagen"
              >
                <ZoomIn className="w-4 h-4 text-champagne" />
              </button>

              {/* Gender & Longevity Chip */}
              <div className="absolute bottom-5 left-5 z-10 hidden sm:block">
                <span className="bg-espresso/80 backdrop-blur-md text-sand text-[11px] px-3 py-1 rounded-full border border-sand/20">
                  {product.gender} • {product.longevity}
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel with Smooth Selection */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 sm:w-24 aspect-[4/5] rounded-cowboy overflow-hidden border flex-shrink-0 transition-all duration-300 relative ${
                      selectedImageIndex === idx
                        ? "border-champagne ring-2 ring-champagne/50 shadow-md scale-105"
                        : "border-sand/70 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${product.name} miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Pure Extraction Guarantee Strip */}
            <div className="p-6 rounded-cowboy bg-sand/20 border border-sand flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-champagne/15 border border-champagne/30 flex items-center justify-center text-champagne flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-editorial text-base font-medium text-espresso">
                  Garantía de Pureza & Fraccionamiento en Cristal
                </h4>
                <p className="text-xs text-smoke font-light leading-relaxed">
                  Cada muestra es extraída bajo pedido con instrumental de grado boticario en atomizadores de cristal neutro hermético. Preserva íntegramente las notas de salida sin dilución ni contacto con plásticos.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Editorial Content, Variant Selector, Pricing & Cart */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Header Block */}
            <div className="border-b border-sand pb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-luxury text-taupe">
                  {product.brand_name} • {product.category_name}
                </span>
                <button
                  onClick={handleShare}
                  className="text-xs text-graphite hover:text-espresso flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-champagne" />
                  <span>{copiedLink ? "¡Enlace copiado!" : "Compartir"}</span>
                </button>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-espresso leading-tight">
                {product.name}
              </h1>

              {/* Dynamic Price Display */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-espresso transition-all duration-300">
                  {formatPrice(selectedVariant.price)}
                </span>
                {selectedVariant.compare_at_price && (
                  <span className="text-base text-taupe line-through">
                    {formatPrice(selectedVariant.compare_at_price)}
                  </span>
                )}
                <span className="text-xs text-champagne font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-sand/25 border border-sand">
                  {selectedVariant.name}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-smoke font-light leading-relaxed pt-2">
                {product.short_description}
              </p>
            </div>

            {/* ELEGANT VARIANT SELECTOR (5 ml, 10 ml, 100 ml) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-luxury text-espresso">
                  Elige tu Formato o Tamaño:
                </span>
                <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {selectedVariant.is_available
                    ? `${selectedVariant.stock} unidades disponibles`
                    : "Agotado temporalmente"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedVariant(v);
                        setQuantity(1);
                      }}
                      disabled={!v.is_available || v.stock <= 0}
                      className={`p-4 rounded-cowboy border text-left flex items-center justify-between transition-all duration-300 ${
                        isSelected
                          ? "border-champagne bg-white ring-2 ring-champagne/40 shadow-md scale-[1.01]"
                          : "border-sand bg-sand/15 hover:bg-white hover:border-sand/90"
                      } ${!v.is_available ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? "border-champagne bg-espresso text-champagne"
                              : "border-sand/80 bg-white"
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-champagne" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-espresso">{v.name}</p>
                          <p className="text-[11px] text-taupe font-light">
                            {v.size_ml === 5
                              ? "Aprox. 75 atomizaciones • Ideal para evaluar en piel"
                              : v.size_ml === 10
                              ? "Aprox. 150 atomizaciones • Formato de bolsillo o viaje"
                              : "Presentación sellada en frasco original con caja de lujo"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-espresso block">
                          {formatPrice(v.price)}
                        </span>
                        {v.compare_at_price && (
                          <span className="text-[10px] text-taupe line-through">
                            {formatPrice(v.compare_at_price)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUANTITY STEPPER & PROMINENT PURCHASE ACTION */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                {/* Stepper */}
                <div className="inline-flex items-center border border-sand rounded-full bg-sand/30 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-graphite hover:text-espresso disabled:opacity-40 shadow-sm transition-transform active:scale-95"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-espresso">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                    disabled={quantity >= selectedVariant.stock}
                    className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-graphite hover:text-espresso disabled:opacity-40 shadow-sm transition-transform active:scale-95"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant.is_available || selectedVariant.stock <= 0}
                  className="btn-gold flex-1 py-4 text-xs font-bold tracking-wide justify-center shadow-xl flex items-center gap-2"
                >
                  {selectedVariant.is_available && selectedVariant.stock > 0 ? (
                    <>
                      <span>Agregar a la Bolsa</span>
                      <span>•</span>
                      <span>{formatPrice(selectedVariant.price * quantity)}</span>
                    </>
                  ) : (
                    <span>Formato Temporalmente Agotado</span>
                  )}
                </button>
              </div>

              {/* Added Feedback Toast */}
              {addedToast && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-cowboy text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in duration-200 shadow-sm">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">
                    ¡Fragancia agregada exitosamente! Tu bolsa se ha actualizado.
                  </span>
                </div>
              )}
            </div>

            {/* Performance Indicators Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-sand text-center text-xs">
              <div className="p-3 rounded-cowboy bg-sand/20 border border-sand/60">
                <Droplet className="w-4 h-4 text-champagne mx-auto mb-1" />
                <span className="text-[10px] text-taupe block uppercase font-medium">Concentración</span>
                <span className="font-semibold text-espresso">{product.concentration}</span>
              </div>
              <div className="p-3 rounded-cowboy bg-sand/20 border border-sand/60">
                <Clock className="w-4 h-4 text-champagne mx-auto mb-1" />
                <span className="text-[10px] text-taupe block uppercase font-medium">Longevidad</span>
                <span className="font-semibold text-espresso">{product.longevity}</span>
              </div>
              <div className="p-3 rounded-cowboy bg-sand/20 border border-sand/60">
                <Wind className="w-4 h-4 text-champagne mx-auto mb-1" />
                <span className="text-[10px] text-taupe block uppercase font-medium">Estela / Sillage</span>
                <span className="font-semibold text-espresso">{product.sillage}</span>
              </div>
              <div className="p-3 rounded-cowboy bg-sand/20 border border-sand/60">
                <Sparkles className="w-4 h-4 text-champagne mx-auto mb-1" />
                <span className="text-[10px] text-taupe block uppercase font-medium">Género</span>
                <span className="font-semibold text-espresso">{product.gender}</span>
              </div>
            </div>

            {/* EDITORIAL OLFACTORY ARCHITECTURE (Pyramid & Narrative) */}
            <div className="divide-y divide-sand border-b border-sand text-xs space-y-2">
              
              {/* Accordion 1: Pirámide Olfativa Completa */}
              <div className="pt-2 pb-4">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "pyramid" ? "" : "pyramid")}
                  className="w-full flex items-center justify-between text-left font-medium text-espresso"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-champagne" />
                    <span className="font-editorial text-lg">Pirámide Olfativa Tridimensional</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-taupe transition-transform duration-300 ${
                      openAccordion === "pyramid" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordion === "pyramid" && (
                  <div className="pt-4 space-y-3 animate-in fade-in duration-300">
                    
                    {/* Top Tier */}
                    <div className="p-4 rounded-cowboy bg-white border border-sand/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-espresso text-[11px] uppercase tracking-wider">
                          Notas de Salida (0 a 30 minutos)
                        </span>
                        <span className="text-[10px] text-taupe">Primer Impacto</span>
                      </div>
                      <p className="text-smoke font-light leading-relaxed">
                        {product.top_notes.join(" • ")}
                      </p>
                    </div>

                    {/* Heart Tier */}
                    <div className="p-4 rounded-cowboy bg-white border border-sand/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-espresso text-[11px] uppercase tracking-wider">
                          Notas de Corazón (2 a 6 horas)
                        </span>
                        <span className="text-[10px] text-taupe">Cuerpo & Carácter</span>
                      </div>
                      <p className="text-smoke font-light leading-relaxed">
                        {product.heart_notes.join(" • ")}
                      </p>
                    </div>

                    {/* Base Tier */}
                    <div className="p-4 rounded-cowboy bg-white border border-sand/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-espresso text-[11px] uppercase tracking-wider">
                          Notas de Fondo (6 a 16+ horas)
                        </span>
                        <span className="text-[10px] text-champagne font-semibold">Fijación Terminal</span>
                      </div>
                      <p className="text-smoke font-light leading-relaxed">
                        {product.base_notes.join(" • ")}
                      </p>
                    </div>

                  </div>
                )}
              </div>

              {/* Accordion 2: Análisis Olfativo & Ocasión */}
              <div className="py-4">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "desc" ? "" : "desc")}
                  className="w-full flex items-center justify-between text-left font-medium text-espresso"
                >
                  <span className="font-editorial text-lg">Análisis de Estilo & Ocasión</span>
                  <ChevronDown
                    className={`w-4 h-4 text-taupe transition-transform duration-300 ${
                      openAccordion === "desc" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordion === "desc" && (
                  <div className="pt-3 text-smoke leading-relaxed space-y-3 font-light animate-in fade-in duration-300">
                    <p>{product.description}</p>
                    <div className="p-3.5 rounded-cowboy bg-sand/20 border border-sand space-y-1">
                      <p className="text-espresso font-medium">
                        Ocasión recomendada: <span className="font-light text-taupe">{product.occasion}</span>
                      </p>
                      <p className="text-espresso font-medium">
                        Clima & Estación: <span className="font-light text-taupe">{product.season}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Envíos & Seguridad */}
              <div className="py-4">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "shipping" ? "" : "shipping")}
                  className="w-full flex items-center justify-between text-left font-medium text-espresso"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-champagne" />
                    <span className="font-editorial text-lg">Envíos Colombia & Medios de Pago</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-taupe transition-transform duration-300 ${
                      openAccordion === "shipping" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordion === "shipping" && (
                  <div className="pt-3 text-smoke leading-relaxed space-y-2 font-light animate-in fade-in duration-300">
                    <p>
                      • <strong>Cobertura Nacional:</strong> Despachos por transportadora oficial con número de guía inmediato (2 a 4 días hábiles).
                    </p>
                    <p>
                      • <strong>Envío Gratis:</strong> Automático en pedidos superiores a $200.000 COP.
                    </p>
                    <p>
                      • <strong>Métodos de Pago:</strong> Pago Contra Entrega en efectivo al recibir, Transferencia Bancolombia / Nequi o tarjeta de crédito en pasarela segura.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS SHOWCASE */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-sand">
            <RevealOnScroll direction="up" delayMs={40}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-luxury text-champagne font-semibold block mb-1">
                    Armonía Olfativa
                  </span>
                  <h3 className="font-editorial text-3xl font-normal text-espresso">
                    Fragancias con Perfil Complementario
                  </h3>
                </div>

                <Link
                  href="/perfumes"
                  className="btn-secondary text-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Ver Colección Completa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rel, idx) => (
                <RevealOnScroll key={rel.id} direction="up" delayMs={idx * 60}>
                  <Link
                    href={`/perfumes/${rel.id}`}
                    className="group block bg-white rounded-cowboy border border-sand hover:border-espresso transition-all duration-400 overflow-hidden shadow-sm hover:shadow-lg"
                  >
                    <div className="aspect-[4/5] bg-sand/15 overflow-hidden relative glass-sheen">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rel.primary_image}
                        alt={rel.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <p className="text-[10px] uppercase font-semibold text-taupe tracking-wider">
                        {rel.brand_name}
                      </p>
                      <h4 className="font-editorial text-lg text-espresso group-hover:text-champagne transition-colors line-clamp-1">
                        {rel.name}
                      </h4>
                      <p className="text-xs font-semibold text-espresso">
                        Desde {formatPrice(Math.min(...rel.variants.map((v) => v.price)))}
                      </p>
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FULL-SCREEN IMMERSIVE LIGHTROOM ZOOM MODAL */}
      {zoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-espresso/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setZoomModalOpen(false)}
        >
          <button
            onClick={() => setZoomModalOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-sand/10 text-porcelain hover:bg-sand/20 transition-colors z-50"
            aria-label="Cerrar ampliación"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-cowboy shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full max-h-[85vh] object-contain"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-espresso/80 backdrop-blur-md p-3 rounded-cowboy text-center text-xs text-sand">
              {product.name} — Fotografía de Alta Resolución A&D Parfum
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
