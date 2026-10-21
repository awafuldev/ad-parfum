"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ShoppingBag,
  MessageCircle,
} from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";
import { RevealOnScroll } from "@/components/ui/motion/RevealOnScroll";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const { addItem, openCart } = useCart();

  // Find default variant: preference to 10ml, then first available, or first
  const defaultVariant =
    product.variants.find((v) => v.is_available && v.stock > 0 && v.size_ml === 10) ||
    product.variants.find((v) => v.is_available && v.stock > 0) ||
    product.variants[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>("shipping");
  const [showStickyBar, setShowStickyBar] = useState(false);

  const mainActionRef = useRef<HTMLDivElement>(null);

  const images = product.images && product.images.length > 0 ? product.images : [product.primary_image];
  const activeImage = images[selectedImageIndex] || product.primary_image;

  // Observe when the main buy action scrolls out of view on mobile to show sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (!mainActionRef.current) return;
      const rect = mainActionRef.current.getBoundingClientRect();
      // If the buy button is above the viewport
      if (rect.bottom < 0) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const getVariantLabel = (variant: ProductVariant) => {
    if (variant.size_ml === 5) return "5 ml";
    if (variant.size_ml === 10) return "10 ml";
    if (variant.size_ml >= 30) return `Botella completa (${variant.size_ml} ml)`;
    return `${variant.size_ml} ml`;
  };

  const getVariantSublabel = (variant: ProductVariant) => {
    if (variant.size_ml === 5) return "Decant (~75 sprays) • Ideal para probar";
    if (variant.size_ml === 10) return "Decant de viaje (~150 sprays) • Más popular";
    if (variant.size_ml >= 30) return "Frasco sellado original en caja de fábrica";
    return `Presentación de ${variant.size_ml} ml`;
  };

  const hasOlfactoryNotes =
    (product.top_notes && product.top_notes.length > 0) ||
    (product.heart_notes && product.heart_notes.length > 0) ||
    (product.base_notes && product.base_notes.length > 0);

  return (
    <div className="py-6 sm:py-10 lg:py-14 bg-porcelain">
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Navegación de migas de pan" className="flex items-center gap-2 text-xs text-taupe mb-6 sm:mb-8">
          <Link href="/" className="hover:text-espresso transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/perfumes" className="hover:text-espresso transition-colors">
            Perfumes
          </Link>
          <span>/</span>
          <span className="text-graphite font-medium">{product.brand_name}</span>
          <span>/</span>
          <span className="text-espresso font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* ========================================================= */}
          {/* 1. LEFT COLUMN: Gallery & Visuals                          */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-28">
            
            {/* Main Image Stage */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-sand shadow-sm group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={`${product.name} — ${product.brand_name}`}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103 cursor-pointer"
                onClick={() => setZoomModalOpen(true)}
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                {product.is_bestseller && (
                  <span className="bg-espresso text-champagne text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-champagne/40 shadow-sm">
                    Más Vendido
                  </span>
                )}
                <span className="bg-white/95 backdrop-blur-sm text-espresso text-[11px] font-semibold px-3 py-0.5 rounded-full border border-sand shadow-sm self-start">
                  {product.concentration}
                </span>
              </div>

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setZoomModalOpen(true)}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full border border-sand text-espresso hover:bg-white shadow-md transition-all hover:scale-110 z-10"
                title="Ampliar fotografía"
                aria-label="Ampliar fotografía a pantalla completa"
              >
                <ZoomIn className="w-4 h-4 text-espresso" />
              </button>

              {/* Discreet Gender & Longevity */}
              <div className="absolute bottom-4 left-4 z-10 hidden sm:block pointer-events-none">
                <span className="bg-espresso/80 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full border border-white/10">
                  {product.gender} • {product.longevity}
                </span>
              </div>
            </div>

            {/* Discreet Thumbnails (Only when multiple images exist) */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-18 sm:w-20 aspect-[4/5] rounded-xl overflow-hidden border flex-shrink-0 transition-all duration-200 relative ${
                      selectedImageIndex === idx
                        ? "border-espresso ring-2 ring-espresso/30 shadow-sm scale-102"
                        : "border-sand/70 opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Ver imagen ${idx + 1}`}
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

            {/* Dominican Trust Badges Strip */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs text-smoke">
              <div className="p-3 rounded-xl bg-white border border-sand/70 flex flex-col items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-wine" />
                <span className="font-semibold text-[11px] text-espresso leading-tight">100% Original</span>
                <span className="text-[10px] text-taupe">Genuino de fábrica</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-sand/70 flex flex-col items-center justify-center gap-1">
                <Droplet className="w-4 h-4 text-wine" />
                <span className="font-semibold text-[11px] text-espresso leading-tight">Decant en Cristal</span>
                <span className="text-[10px] text-taupe">Fraccionado estéril</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-sand/70 flex flex-col items-center justify-center gap-1">
                <Truck className="w-4 h-4 text-wine" />
                <span className="font-semibold text-[11px] text-espresso leading-tight">Envíos a Todo RD</span>
                <span className="text-[10px] text-taupe">Con guía y seguro</span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* 2. RIGHT COLUMN: Immediate Purchase Information           */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header Block: Brand, Name & Share */}
            <div className="space-y-2 border-b border-sand pb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-taupe">
                  {product.brand_name} • {product.category_name}
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="text-xs text-taupe hover:text-espresso flex items-center gap-1.5 transition-colors p-1"
                  title="Copiar enlace"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? "¡Copiado!" : "Compartir"}</span>
                </button>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-medium text-espresso leading-tight">
                {product.name}
              </h1>

              {/* Brief description & Olfactory Family */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sand/40 text-espresso border border-sand">
                  <Sparkles className="w-3 h-3 text-wine" />
                  Familia: {product.olfactory_family}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-taupe border border-sand">
                  {product.gender}
                </span>
              </div>

              <p className="text-sm text-smoke font-normal leading-relaxed pt-2">
                {product.short_description}
              </p>
            </div>

            {/* Dynamic Price Display */}
            <div className="bg-sand/15 p-4 sm:p-5 rounded-2xl border border-sand/70 space-y-4">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-espresso tracking-tight">
                    {formatPrice(selectedVariant.price)}
                  </span>
                  {selectedVariant.compare_at_price && (
                    <span className="text-base text-taupe line-through">
                      {formatPrice(selectedVariant.compare_at_price)}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-white text-espresso border border-sand shadow-2xs">
                  {selectedVariant.name}
                </span>
              </div>

              {/* Selector de Presentación (5 ml, 10 ml, Botella Completa) */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso">
                  Elige tu formato o presentación:
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    const isAvailable = v.is_available && v.stock > 0;

                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedVariant(v);
                            setQuantity(1);
                          }
                        }}
                        disabled={!isAvailable}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${
                          isSelected
                            ? "border-espresso bg-white ring-2 ring-espresso shadow-sm"
                            : isAvailable
                            ? "border-sand bg-white/70 hover:bg-white hover:border-sand/90 text-espresso"
                            : "border-sand/50 bg-sand/20 opacity-50 cursor-not-allowed text-taupe"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected
                                ? "border-espresso bg-espresso"
                                : "border-sand bg-white"
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-espresso">
                                {getVariantLabel(v)}
                              </span>
                              {!isAvailable && (
                                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.2 rounded">
                                  Agotado
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-taupe font-normal block">
                              {getVariantSublabel(v)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-espresso block">
                            {formatPrice(v.price)}
                          </span>
                          {v.compare_at_price && (
                            <span className="text-[10px] text-taupe line-through block">
                              {formatPrice(v.compare_at_price)}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Disponibilidad en Tiempo Real */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-sand/60">
                <div className="flex items-center gap-2">
                  {selectedVariant.is_available && selectedVariant.stock > 0 ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold text-emerald-800">
                        En stock
                      </span>
                      <span className="text-taupe">
                        ({selectedVariant.stock} unidades para despacho inmediato en RD)
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="font-semibold text-red-700">
                        Agotado temporalmente
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Main «Añadir al carrito» Action */}
              <div ref={mainActionRef} className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  
                  {/* Stepper */}
                  <div className="inline-flex items-center border border-sand rounded-xl bg-white p-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || !selectedVariant.is_available || selectedVariant.stock <= 0}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-graphite hover:text-espresso hover:bg-sand/30 disabled:opacity-30 transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-espresso">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                      disabled={quantity >= selectedVariant.stock || !selectedVariant.is_available || selectedVariant.stock <= 0}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-graphite hover:text-espresso hover:bg-sand/30 disabled:opacity-30 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Main Purchase Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant.is_available || selectedVariant.stock <= 0}
                    className="flex-1 btn-primary py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-wide rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {selectedVariant.is_available && selectedVariant.stock > 0 ? (
                      <span>
                        Añadir al carrito • {formatPrice(selectedVariant.price * quantity)}
                      </span>
                    ) : (
                      <span>Presentación Agotada</span>
                    )}
                  </button>
                </div>

                {/* Inline Confirmation Toast */}
                {addedToast && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-semibold">
                      ¡Agregado al carrito! Tu bolsa de compra se ha actualizado.
                    </span>
                  </div>
                )}
              </div>

              {/* Fast WhatsApp Direct Order / Question */}
              <div className="pt-1 text-center">
                <a
                  href={`https://wa.me/18293751717?text=${encodeURIComponent(
                    `Hola A&D Parfum, deseo consultar sobre la fragancia ${product.name} (${product.brand_name}) en presentación ${getVariantLabel(
                      selectedVariant
                    )}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-taupe hover:text-espresso inline-flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>¿Prefieres pedir o consultar por WhatsApp? Escríbenos aquí</span>
                </a>
              </div>

            </div>

            {/* Quick Specs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-white border border-sand/80">
                <Droplet className="w-4 h-4 text-wine mx-auto mb-1" />
                <span className="text-[10px] text-taupe uppercase font-semibold block">Concentración</span>
                <span className="font-bold text-espresso text-[11px]">{product.concentration}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-sand/80">
                <Clock className="w-4 h-4 text-wine mx-auto mb-1" />
                <span className="text-[10px] text-taupe uppercase font-semibold block">Duración</span>
                <span className="font-bold text-espresso text-[11px]">{product.longevity}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-sand/80">
                <Wind className="w-4 h-4 text-wine mx-auto mb-1" />
                <span className="text-[10px] text-taupe uppercase font-semibold block">Proyección</span>
                <span className="font-bold text-espresso text-[11px]">{product.sillage}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-sand/80">
                <Sparkles className="w-4 h-4 text-wine mx-auto mb-1" />
                <span className="text-[10px] text-taupe uppercase font-semibold block">Ocasión</span>
                <span className="font-bold text-espresso text-[11px] truncate block" title={product.occasion}>
                  {product.occasion}
                </span>
              </div>
            </div>

            {/* Secondary Sections: Pirámide Olfativa & Accordions */}
            <div className="space-y-4 pt-2">
              
              {/* Pirámide Olfativa Clara y Fácil de Leer */}
              {hasOlfactoryNotes && (
                <div className="bg-white rounded-2xl border border-sand p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-sand pb-3">
                    <Layers className="w-4 h-4 text-wine" />
                    <h2 className="font-editorial text-lg font-semibold text-espresso">
                      Pirámide Olfativa
                    </h2>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {product.top_notes && product.top_notes.length > 0 && (
                      <div className="p-3 rounded-xl bg-sand/15 border border-sand/60">
                        <span className="text-[10px] uppercase font-bold text-espresso tracking-wider block mb-0.5">
                          Notas de Salida (Primeros 15-30 minutos)
                        </span>
                        <p className="text-smoke font-normal leading-relaxed">
                          {product.top_notes.join(" • ")}
                        </p>
                      </div>
                    )}

                    {product.heart_notes && product.heart_notes.length > 0 && (
                      <div className="p-3 rounded-xl bg-sand/15 border border-sand/60">
                        <span className="text-[10px] uppercase font-bold text-espresso tracking-wider block mb-0.5">
                          Notas de Corazón (Cuerpo y personalidad, 2 a 6 horas)
                        </span>
                        <p className="text-smoke font-normal leading-relaxed">
                          {product.heart_notes.join(" • ")}
                        </p>
                      </div>
                    )}

                    {product.base_notes && product.base_notes.length > 0 && (
                      <div className="p-3 rounded-xl bg-sand/15 border border-sand/60">
                        <span className="text-[10px] uppercase font-bold text-espresso tracking-wider block mb-0.5">
                          Notas de Fondo (Fijación en piel y ropa, 8 a 16+ horas)
                        </span>
                        <p className="text-smoke font-normal leading-relaxed">
                          {product.base_notes.join(" • ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Accordions: Envíos & Garantía */}
              <div className="divide-y divide-sand border border-sand rounded-2xl bg-white overflow-hidden text-xs shadow-2xs">
                
                {/* Accordion: Envíos en República Dominicana */}
                <div className="p-4">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "shipping" ? "" : "shipping")}
                    className="w-full flex items-center justify-between text-left font-semibold text-espresso"
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-wine" />
                      <span>Envíos en República Dominicana & Métodos de Pago</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-taupe transition-transform duration-200 ${
                        openAccordion === "shipping" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openAccordion === "shipping" && (
                    <div className="pt-3 text-smoke leading-relaxed space-y-2 border-t border-sand/60 mt-3 animate-in fade-in duration-200">
                      <p>
                        • <strong>Cobertura nacional:</strong> Envíos a Santo Domingo, Santiago, Punta Cana, La Romana y todas las provincias del país con número de seguimiento.
                      </p>
                      <p>
                        • <strong>Métodos de Pago:</strong> Pago Contra Entrega al recibir (efectivo), Transferencia Bancaria Directa (Banreservas, Banco Popular, Banco BHD) o Tarjeta de Crédito/Débito.
                      </p>
                      <p>
                        • <strong>Empaque Seguro:</strong> Cada botella o decant se embala con protección antichoque hermética para asegurar que llegue en perfecto estado.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion: Descripción extendida */}
                {product.description && (
                  <div className="p-4">
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(openAccordion === "desc" ? "" : "desc")}
                      className="w-full flex items-center justify-between text-left font-semibold text-espresso"
                    >
                      <span className="text-sm">Descripción Detallada del Perfume</span>
                      <ChevronDown
                        className={`w-4 h-4 text-taupe transition-transform duration-200 ${
                          openAccordion === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openAccordion === "desc" && (
                      <div className="pt-3 text-smoke leading-relaxed space-y-2 border-t border-sand/60 mt-3 animate-in fade-in duration-200 font-normal">
                        <p>{product.description}</p>
                        {product.season && (
                          <p className="text-espresso font-medium pt-1">
                            Clima / Temporada ideal: <span className="font-normal text-taupe">{product.season}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* 3. RELATED PRODUCTS RECOMMENDATIONS                       */}
        {/* ========================================================= */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-sand">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-wine block mb-1">
                  Recomendaciones
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-espresso">
                  Otras fragancias que podrían gustarte
                </h3>
              </div>

              <Link
                href="/perfumes"
                className="btn-secondary text-xs flex items-center gap-1.5 self-start sm:self-auto py-2.5 px-4"
              >
                <span>Ver catálogo completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((rel) => {
                const minPrice = Math.min(...rel.variants.map((v) => v.price));
                return (
                  <Link
                    key={rel.id}
                    href={`/perfumes/${rel.id}`}
                    className="group block bg-white rounded-2xl border border-sand hover:border-espresso transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-md"
                  >
                    <div className="aspect-[4/5] bg-sand/15 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rel.primary_image}
                        alt={rel.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3.5 sm:p-4 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-taupe tracking-wider truncate">
                        {rel.brand_name}
                      </p>
                      <h4 className="font-editorial text-base sm:text-lg font-medium text-espresso group-hover:text-wine transition-colors line-clamp-1">
                        {rel.name}
                      </h4>
                      <p className="text-xs sm:text-sm font-bold text-espresso">
                        Desde {formatPrice(minPrice)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* 4. MOBILE STICKY BOTTOM BAR (Smooth Purchase Access)      */}
      {/* ========================================================= */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-sand px-4 py-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.name}
              className="w-10 h-12 object-cover rounded-lg border border-sand flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-espresso truncate">
                {product.name}
              </p>
              <p className="text-[11px] text-taupe truncate">
                {getVariantLabel(selectedVariant)} • <strong className="text-espresso">{formatPrice(selectedVariant.price * quantity)}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedVariant.is_available || selectedVariant.stock <= 0}
            className="btn-primary py-2.5 px-4 text-xs font-bold rounded-xl flex-shrink-0 flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Añadir</span>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. LIGHTBOX ZOOM MODAL (High Resolution Product Gallery)   */}
      {/* ========================================================= */}
      {zoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-espresso/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomModalOpen(false)}
        >
          <button
            type="button"
            onClick={() => setZoomModalOpen(false)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            aria-label="Cerrar ampliación"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full max-h-[85vh] object-contain"
            />
            <div className="absolute bottom-3 left-3 right-3 bg-espresso/80 backdrop-blur-md p-2.5 rounded-xl text-center text-xs text-white">
              {product.name} — {product.brand_name} (Fotografía oficial A&D Parfum)
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
