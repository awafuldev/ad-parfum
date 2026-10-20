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
  const { addItem } = useCart();

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

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string>("notes");

  const images = product.images.length > 0 ? product.images : [product.primary_image];
  const activeImage = images[selectedImageIndex] || product.primary_image;

  const handleAddToCart = () => {
    if (!selectedVariant.is_available || selectedVariant.stock <= 0) return;
    const ok = addItem(product, selectedVariant, quantity);
    if (ok) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
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
    <div className="py-12 bg-porcelain">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
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
          <span className="text-espresso font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <GlassTiltCard className="relative aspect-[4/5] rounded-cowboy overflow-hidden bg-white border border-sand group shadow-md hover:shadow-2xl transition-all duration-500 glass-sheen">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-900 ease-out group-hover:scale-106"
              />

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setZoomModalOpen(true)}
                className="absolute bottom-4 right-4 bg-porcelain/90 backdrop-blur-md p-3 rounded-full border border-sand text-espresso hover:bg-white shadow-lg transition-all hover:scale-110 z-10"
                title="Ampliar fotografía"
                aria-label="Ampliar imagen"
              >
                <ZoomIn className="w-4 h-4 text-champagne" />
              </button>

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.is_bestseller && (
                  <span className="bg-espresso text-champagne text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-champagne/40 shadow-sm">
                    Bestseller
                  </span>
                )}
                <span className="bg-porcelain/95 text-espresso text-[10px] font-medium px-3 py-1 rounded-full border border-sand shadow-sm">
                  {product.concentration}
                </span>
              </div>
            </GlassTiltCard>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-24 rounded-cowboy overflow-hidden border flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? "border-champagne ring-2 ring-champagne/40"
                        : "border-sand opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${product.name} - miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Extraction Guarantee Callout */}
            <div className="p-6 rounded-cowboy bg-sand/20 border border-sand mt-6 space-y-2">
              <div className="flex items-center gap-2 text-espresso font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-champagne" />
                <span>Garantía de Pureza & Atomizador de Cristal A&D Parfum</span>
              </div>
              <p className="text-xs text-smoke leading-relaxed font-light">
                Nuestros decants son fraccionados bajo pedido con atomizadores de rosca y cristal neutro. No utilizamos plásticos que alteren las notas aromáticas ni diluimos el perfume.
              </p>
            </div>
          </div>

          {/* Right Column: Information, Variant Selector & Purchase */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header Info */}
            <div className="border-b border-sand pb-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[10px] uppercase font-semibold tracking-luxury text-taupe">
                  {product.brand_name}
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

              {/* Price Preview */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-espresso">
                  {formatPrice(selectedVariant.price)}
                </span>
                {selectedVariant.compare_at_price && (
                  <span className="text-sm text-taupe line-through">
                    {formatPrice(selectedVariant.compare_at_price)}
                  </span>
                )}
                <span className="text-xs text-graphite font-medium">
                  ({selectedVariant.name})
                </span>
              </div>

              <p className="text-xs sm:text-sm text-smoke mt-3 leading-relaxed font-light">
                {product.short_description}
              </p>
            </div>

            {/* Format / Variant Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-luxury text-espresso">
                  Selecciona Formato o Tamaño:
                </span>
                <span className="text-[11px] text-taupe">
                  {selectedVariant.is_available
                    ? `${selectedVariant.stock} unidades en stock`
                    : "Agotado"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setQuantity(1);
                      }}
                      disabled={!v.is_available || v.stock <= 0}
                      className={`p-4 rounded-cowboy border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-champagne bg-white ring-2 ring-champagne/30 shadow-sm"
                          : "border-sand bg-sand/15 hover:bg-white hover:border-sand/90"
                      } ${!v.is_available ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-champagne bg-espresso text-champagne"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-champagne" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-espresso">{v.name}</p>
                          <p className="text-[11px] text-taupe font-light">
                            {v.size_ml === 5
                              ? "Aprox. 75 atomizaciones • Ideal para prueba en piel"
                              : v.size_ml === 10
                              ? "Aprox. 150 atomizaciones • Formato de viaje y bolso"
                              : "Presentación sellada en frasco original con caja oficial"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-espresso block">
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

            {/* Quantity Selector & Add to Cart */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-4">
                {/* Stepper */}
                <div className="inline-flex items-center border border-sand rounded-full bg-sand/30 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-graphite hover:text-espresso disabled:opacity-40 shadow-sm"
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
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-graphite hover:text-espresso disabled:opacity-40 shadow-sm"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add Action */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant.is_available || selectedVariant.stock <= 0}
                  className="btn-gold flex-1 py-4 text-xs font-semibold tracking-wide justify-center shadow-lg"
                >
                  {selectedVariant.is_available && selectedVariant.stock > 0 ? (
                    <span>
                      Agregar a la Bolsa • {formatPrice(selectedVariant.price * quantity)}
                    </span>
                  ) : (
                    <span>Formato Agotado</span>
                  )}
                </button>
              </div>

              {/* Added Toast */}
              {addedToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-cowboy text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    ¡Fragancia agregada exitosamente! Revisa tu bolsa para finalizar la compra.
                  </span>
                </div>
              )}
            </div>

            {/* Quick Metrics Badge Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-sand text-center text-xs">
              <div className="p-3 rounded-cowboy bg-sand/20 border border-sand/60">
                <Droplet className="w-4 h-4 text-champagne mx-auto mb-1" />
                <span className="text-[10px] text-taupe block uppercase font-medium">Concentración</span>
                <span className="font-semibold text-espresso">{product.concentration}</span>
              </div>
              <div className="p-3 rounded-cowboy bg-sand/20 border border-sand/60">
                <Clock className="w-4 h-4 text-champagne mx-auto mb-1" />
                <span className="text-[10px] text-taupe block uppercase font-medium">Duración</span>
                <span className="font-semibold text-espresso">{product.longevity}</span>
              </div>
              <div className="p-3 rounded-cowboy bg-sand/20 border border-sand/60">
                <Wind className="w-4 h-4 text-champagne mx-auto mb-1" />
                <span className="text-[10px] text-taupe block uppercase font-medium">Proyección</span>
                <span className="font-semibold text-espresso">{product.sillage}</span>
              </div>
              <div className="p-3 rounded-cowboy bg-sand/20 border border-sand/60">
                <Sparkles className="w-4 h-4 text-champagne mx-auto mb-1" />
                <span className="text-[10px] text-taupe block uppercase font-medium">Género</span>
                <span className="font-semibold text-espresso">{product.gender}</span>
              </div>
            </div>

            {/* Editorial Olfactory Pyramid Accordion */}
            <div className="divide-y divide-sand border-b border-sand text-xs">
              
              {/* Accordion 1: Pirámide Olfativa */}
              <div className="py-4">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "notes" ? "" : "notes")}
                  className="w-full flex items-center justify-between text-left font-medium text-espresso"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-champagne" />
                    <span className="font-editorial text-base">Pirámide Olfativa Completa</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-taupe transition-transform ${
                      openAccordion === "notes" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordion === "notes" && (
                  <div className="pt-4 space-y-3 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-cowboy bg-sand/25 border border-sand/60">
                      <p className="font-semibold text-espresso text-[11px] mb-1">
                        Notas de Salida (Primeros 15-30 minutos):
                      </p>
                      <p className="text-smoke font-light">{product.top_notes.join(" • ")}</p>
                    </div>

                    <div className="p-3.5 rounded-cowboy bg-sand/25 border border-sand/60">
                      <p className="font-semibold text-espresso text-[11px] mb-1">
                        Notas de Corazón (2 a 6 horas):
                      </p>
                      <p className="text-smoke font-light">{product.heart_notes.join(" • ")}</p>
                    </div>

                    <div className="p-3.5 rounded-cowboy bg-sand/25 border border-sand/60">
                      <p className="font-semibold text-espresso text-[11px] mb-1">
                        Notas de Fondo / Secado (Fijación terminal):
                      </p>
                      <p className="text-smoke font-light">{product.base_notes.join(" • ")}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Descripción Detallada */}
              <div className="py-4">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "desc" ? "" : "desc")}
                  className="w-full flex items-center justify-between text-left font-medium text-espresso"
                >
                  <span className="font-editorial text-base">Análisis Olfativo & Ocasión</span>
                  <ChevronDown
                    className={`w-4 h-4 text-taupe transition-transform ${
                      openAccordion === "desc" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordion === "desc" && (
                  <div className="pt-3 text-smoke leading-relaxed space-y-2 font-light animate-in fade-in duration-200">
                    <p>{product.description}</p>
                    <p className="pt-2 text-espresso font-medium">
                      Ocasión recomendada: <span className="font-light text-taupe">{product.occasion}</span>
                    </p>
                    <p className="text-espresso font-medium">
                      Estación / Clima ideal: <span className="font-light text-taupe">{product.season}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Envíos & Métodos de Pago */}
              <div className="py-4">
                <button
                  onClick={() => setOpenAccordion(openAccordion === "shipping" ? "" : "shipping")}
                  className="w-full flex items-center justify-between text-left font-medium text-espresso"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-champagne" />
                    <span className="font-editorial text-base">Envíos Nacionales & Métodos de Pago</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-taupe transition-transform ${
                      openAccordion === "shipping" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccordion === "shipping" && (
                  <div className="pt-3 text-smoke leading-relaxed space-y-2 font-light animate-in fade-in duration-200">
                    <p>
                      • <strong>Envíos a toda Colombia:</strong> Despachos por transportadora oficial (2 a 4 días hábiles con guía de rastreo).
                    </p>
                    <p>
                      • <strong>Envío Gratis:</strong> En compras superiores a $200.000 COP.
                    </p>
                    <p>
                      • <strong>Métodos de Pago:</strong> Contra Entrega (Efectivo/Transferencia local al recibir), Transferencia Bancaria Directa (Bancolombia, Nequi, Daviplata) o Tarjeta en línea.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <RevealOnScroll direction="up" delayMs={50} className="mt-28 pt-16 border-t border-sand">
            <div className="mb-10">
              <span className="text-[10px] uppercase tracking-luxury text-champagne font-semibold">
                Sugerencias de la Casa
              </span>
              <h2 className="heading-section text-espresso font-editorial mt-1">
                Fragancias Afines en A&D Parfum
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rel) => {
                const minPrice = Math.min(...rel.variants.map((v) => v.price));
                return (
                  <Link
                    key={rel.id}
                    href={`/perfumes/${rel.id}`}
                    className="group rounded-cowboy border border-sand hover:border-espresso bg-white overflow-hidden p-4 flex flex-col justify-between transition-all shadow-sm hover:shadow-md"
                  >
                    <div>
                      <div className="aspect-[4/5] rounded-cowboy bg-sand/20 overflow-hidden mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rel.primary_image}
                          alt={rel.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                      <p className="text-[10px] uppercase font-semibold text-taupe">{rel.brand_name}</p>
                      <h4 className="font-editorial text-lg font-normal text-espresso line-clamp-1 group-hover:text-champagne-dark transition-colors">
                        {rel.name}
                      </h4>
                      <p className="text-[11px] text-smoke line-clamp-1 mt-1 font-light">{rel.olfactory_family}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-sand/60 flex items-center justify-between">
                      <span className="text-xs font-semibold text-espresso">
                        {formatPrice(minPrice)}
                      </span>
                      <span className="text-[11px] text-champagne-dark font-medium group-hover:underline">
                        Ver Ficha
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </RevealOnScroll>
        )}

      </div>

      {/* Enlarged Zoom Modal */}
      {zoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-espresso/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setZoomModalOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white bg-white/10 rounded-full"
            aria-label="Cerrar ampliación"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[90vh] rounded-cowboy overflow-hidden bg-white shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
