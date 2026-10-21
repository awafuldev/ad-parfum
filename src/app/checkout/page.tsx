"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, buildWhatsAppCartUrl } from "@/lib/formatters";
import { StoreSettings } from "@/types";

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    itemCount,
    clearCart,
  } = useCart();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [lastOrderUrl, setLastOrderUrl] = useState<string | null>(null);

  // Load store settings
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {});
  }, []);

  // Handle direct WhatsApp Checkout
  const handleWhatsAppCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (items.length === 0) return;

    setIsRedirecting(true);

    const whatsappNumber = settings?.whatsapp_number || "18293751717";
    const waUrl = buildWhatsAppCartUrl(
      items,
      subtotal,
      customerName.trim() || undefined,
      customerCity.trim() || undefined,
      whatsappNumber
    );

    setLastOrderUrl(waUrl);

    // Record order in database in the background (fire-and-forget for admin metrics)
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName.trim() || "Cliente WhatsApp",
          customer_email: "",
          customer_phone: "WhatsApp",
          shipping_address: customerCity.trim() || "A coordinar por WhatsApp",
          shipping_city: customerCity.trim() || "Santo Domingo",
          shipping_department: "República Dominicana",
          delivery_notes: "Pedido iniciado vía WhatsApp Checkout",
          shipping_method: "standard",
          payment_method: "contra_entrega",
          items: items.map((i) => ({
            product_id: i.product_id,
            variant_id: i.variant_id,
            quantity: i.quantity,
          })),
        }),
      });
    } catch (err) {
      console.warn("Background order registration note:", err);
    }

    // Open WhatsApp in new tab/window
    window.open(waUrl, "_blank");

    // Clear cart once order is sent
    clearCart();
  };

  // If bag is empty and no order was just sent
  if (items.length === 0 && !lastOrderUrl) {
    return (
      <div className="py-24 bg-ivory text-center">
        <div className="max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-sand/30 flex items-center justify-center mx-auto mb-4 text-wine">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-editorial text-3xl font-normal text-noir mb-2">
            Tu bolsa está vacía
          </h1>
          <p className="text-xs text-gray mb-6 leading-relaxed">
            Agrega tus fragancias o decants favoritos para iniciar tu pedido directo por WhatsApp con entrega en República Dominicana.
          </p>
          <Link href="/perfumes" className="btn-primary text-xs py-3 px-6">
            Explorar Perfumes
          </Link>
        </div>
      </div>
    );
  }

  // Success view if order was just sent
  if (lastOrderUrl) {
    return (
      <div className="py-20 bg-ivory">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          
          <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-noir mb-3">
            ¡Abriendo chat de WhatsApp!
          </h1>
          
          <p className="text-sm text-gray mb-8 leading-relaxed">
            Hemos preparado el detalle de tus fragancias. Si la aplicación de WhatsApp no se abrió automáticamente en tu dispositivo, pulsa el botón a continuación:
          </p>

          <a
            href={lastOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-98"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Abrir WhatsApp Ahora</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="mt-8 pt-8 border-t border-border flex items-center justify-center gap-4 text-xs text-gray">
            <Link href="/" className="hover:text-noir transition-colors underline underline-offset-4">
              Volver al inicio
            </Link>
            <span>•</span>
            <Link href="/perfumes" className="hover:text-noir transition-colors underline underline-offset-4">
              Seguir explorando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-ivory">
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header Breadcrumbs & Title */}
        <div className="pb-6 border-b border-border mb-8">
          <div className="flex items-center gap-2 text-xs text-gray mb-2">
            <Link href="/" className="hover:text-noir transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-noir transition-colors">
              Bolsa
            </Link>
            <span>/</span>
            <span className="text-noir font-semibold">Checkout Simple vía WhatsApp</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-noir tracking-tight">
            Finalizar Pedido vía WhatsApp
          </h1>
          <p className="text-xs sm:text-sm text-gray mt-2 max-w-2xl leading-relaxed">
            En A&D Parfum la compra es directa y sin formularios complejos. Te atendemos personalmente en WhatsApp para confirmar tu pedido, acordar el método de pago y programar tu envío en República Dominicana.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Ultra Simple WhatsApp Checkout Action */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quick Personalization Box (100% Optional) */}
            <div className="bg-white rounded-cowboy border border-border p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-noir font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-wine" />
                <span>Datos opcionales para personalizar tu mensaje:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customer_name" className="block text-xs font-medium text-gray mb-1.5">
                    Tu Nombre <span className="text-[11px] text-gray/60">(opcional)</span>
                  </label>
                  <input
                    id="customer_name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Carlos Pérez"
                    className="w-full px-4 py-2.5 bg-ivory border border-border rounded-xl text-noir text-xs placeholder:text-gray/50 focus:outline-none focus:border-wine focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="customer_city" className="block text-xs font-medium text-gray mb-1.5">
                    Ciudad o Sector <span className="text-[11px] text-gray/60">(opcional)</span>
                  </label>
                  <input
                    id="customer_city"
                    type="text"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="Ej: Santo Domingo, Piantini"
                    className="w-full px-4 py-2.5 bg-ivory border border-border rounded-xl text-noir text-xs placeholder:text-gray/50 focus:outline-none focus:border-wine focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Main Prominent WhatsApp Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleWhatsAppCheckout()}
                  disabled={isRedirecting}
                  className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-3 shadow-lg transition-all active:scale-98 cursor-pointer group disabled:opacity-75"
                >
                  <MessageCircle className="w-5 h-5 fill-white/20 transition-transform group-hover:scale-110" />
                  <span>
                    {isRedirecting ? "Abriendo WhatsApp..." : "Completar Pedido por WhatsApp"}
                  </span>
                  <span className="font-price font-bold bg-white/20 px-2 py-0.5 rounded-full text-xs ml-1">
                    {formatPrice(subtotal)}
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <p className="text-[11px] text-center text-gray/80 leading-relaxed">
                Al pulsar el botón se abrirá WhatsApp con el resumen de tus perfumes listo para enviar al asesor oficial de A&amp;D Parfum (+1 829 375-1717).
              </p>
            </div>

            {/* Service & Delivery Benefits Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-xl border border-border space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-wine">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold text-noir">Respuesta Rápida</span>
                </div>
                <p className="text-[11px] text-gray leading-snug">
                  Atención humana inmediata para resolver cualquier duda.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-border space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-wine">
                  <Truck className="w-4 h-4" />
                  <span className="text-xs font-bold text-noir">Envíos a Todo RD</span>
                </div>
                <p className="text-[11px] text-gray leading-snug">
                  Santo Domingo, Santiago, Punta Cana y todas las provincias.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-border space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-wine">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold text-noir">Pago Flexible</span>
                </div>
                <p className="text-[11px] text-gray leading-snug">
                  Efectivo contra entrega o transferencias (Banreservas / BHD / Popular).
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-cowboy border border-border p-6 sm:p-7 shadow-sm space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h2 className="font-editorial text-xl font-normal text-noir">
                  Resumen de Fragancias
                </h2>
                <span className="text-xs text-gray font-medium">
                  {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-border/60 max-h-80 overflow-y-auto pr-1 space-y-3">
                {items.map((item) => (
                  <div key={item.variant_id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="w-12 h-14 bg-ivory rounded-lg border border-border/80 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-gray uppercase font-semibold tracking-wider">
                        {item.brand_name}
                      </p>
                      <p className="text-xs font-semibold text-noir truncate">
                        {item.product_name}
                      </p>
                      <p className="text-[11px] text-gray/80">
                        {item.variant_name} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-price text-xs font-bold text-noir flex-shrink-0">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-border space-y-2 text-xs text-gray">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-price font-semibold text-noir">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío República Dominicana</span>
                  <span className="text-emerald-700 font-medium">A coordinar por WhatsApp</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <span className="text-sm font-medium text-noir">Total a Pagar</span>
                <span className="font-price text-2xl font-bold text-noir">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Secondary Instant WhatsApp Action */}
              <button
                type="button"
                onClick={() => handleWhatsAppCheckout()}
                disabled={isRedirecting}
                className="w-full py-3 px-4 rounded-full bg-noir hover:bg-wine text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Pedir directo por WhatsApp</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
