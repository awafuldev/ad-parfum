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
  Star,
  Phone,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, buildWhatsAppCartUrl } from "@/lib/formatters";
import { StoreSettings } from "@/types";

/* ─────────────────────────────────────────
   Editorial Header Band (noir, full-width)
───────────────────────────────────────── */
function CheckoutBrand() {
  return (
    <div className="bg-noir text-white py-8 sm:py-10 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-b border-white/10">
      {/* subtle grain overlay */}
      <div className="grain-overlay absolute inset-0 opacity-40 pointer-events-none" />

      {/* thin vertical guide lines — desktop only */}
      <div className="absolute inset-0 pointer-events-none hidden lg:flex justify-between px-16 opacity-10">
        <div className="w-[1px] h-full bg-white/30" />
        <div className="w-[1px] h-full bg-white/30" />
      </div>

      <div className="max-w-editorial mx-auto relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        {/* Brand identity */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-luxury text-white/50 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-wine inline-block" />
            Perfumería 100% Original · República Dominicana
          </p>
          <div className="flex items-center gap-3 pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-light.png"
              alt="Fragance Stock RD"
              className="h-10 w-auto object-contain"
            />
            <h2 className="font-editorial text-2xl sm:text-3xl font-normal tracking-tight text-white leading-none">
              Fragance <span className="italic">Stock RD</span>
            </h2>
          </div>
          <p className="text-xs text-white/55 font-light leading-relaxed max-w-xs pt-1">
            Perfumes y decants auténticos, entregados en República Dominicana.
          </p>
        </div>

        {/* Discrete WA contact */}
        <a
          href="https://wa.me/18096788027"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors group"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
          <span className="font-medium tracking-wide">+1 (809) 678-8027</span>
          <ExternalLink className="w-3 h-3 opacity-50" />
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Trust badges strip
───────────────────────────────────────── */
function TrustStrip() {
  const badges = [
    { icon: ShieldCheck, label: "100% Auténtico" },
    { icon: Truck, label: "Envíos a Todo RD" },
    { icon: Clock, label: "Respuesta Inmediata" },
    { icon: Star, label: "Pago Flexible" },
  ];
  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-10 py-3 overflow-x-auto no-scrollbar">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 text-[11px] font-medium text-gray flex-shrink-0"
            >
              <Icon className="w-3.5 h-3.5 text-wine flex-shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart } = useCart();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [lastOrderUrl, setLastOrderUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {});
  }, []);

  const handleWhatsAppCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (items.length === 0) return;

    setIsRedirecting(true);

    const whatsappNumber = settings?.whatsapp_number || "18096788027";
    const waUrl = buildWhatsAppCartUrl(
      items,
      subtotal,
      customerName.trim() || undefined,
      customerCity.trim() || undefined,
      whatsappNumber
    );

    setLastOrderUrl(waUrl);

    // Fire-and-forget order log for admin metrics
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

    window.open(waUrl, "_blank");
    clearCart();
  };

  /* ── EMPTY BAG ── */
  if (items.length === 0 && !lastOrderUrl) {
    return (
      <>
        <CheckoutBrand />
        <TrustStrip />
        <div className="py-28 bg-ivory text-center">
          <div className="max-w-sm mx-auto px-4">
            <div className="w-16 h-16 rounded-full bg-sand/30 flex items-center justify-center mx-auto mb-5 text-wine">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h1 className="font-editorial text-3xl font-normal text-noir mb-3">
              Tu bolsa está vacía
            </h1>
            <p className="text-xs text-gray mb-8 leading-relaxed">
              Agrega tus fragancias o decants favoritos para iniciar tu pedido
              directo por WhatsApp con entrega en República Dominicana.
            </p>
            <Link href="/perfumes" className="btn-primary text-xs py-3 px-8">
              Explorar Perfumes
            </Link>
          </div>
        </div>
      </>
    );
  }

  /* ── SUCCESS / WA REDIRECT ── */
  if (lastOrderUrl) {
    return (
      <>
        <CheckoutBrand />
        <TrustStrip />
        <div className="py-24 bg-ivory">
          <div className="max-w-lg mx-auto px-4 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-noir">
              ¡Abriendo <span className="italic">WhatsApp</span>!
            </h1>

            <p className="text-sm text-gray leading-relaxed max-w-sm mx-auto">
              Hemos preparado el detalle de tus fragancias. Si la app de
              WhatsApp no se abrió automáticamente, pulsa el botón a
              continuación:
            </p>

            <a
              href={lastOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              <span>Abrir WhatsApp Ahora</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="pt-4 border-t border-border flex items-center justify-center gap-4 text-xs text-gray">
              <Link
                href="/"
                className="hover:text-noir transition-colors underline underline-offset-4"
              >
                Volver al inicio
              </Link>
              <span>•</span>
              <Link
                href="/perfumes"
                className="hover:text-noir transition-colors underline underline-offset-4"
              >
                Seguir explorando
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── MAIN CHECKOUT ── */
  return (
    <>
      <CheckoutBrand />
      <TrustStrip />

      <div className="bg-ivory">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-12">

          {/* ── Breadcrumbs ── */}
          <div className="flex items-center gap-2 text-[11px] text-gray pt-7 pb-5">
            <Link href="/" className="hover:text-noir transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-noir transition-colors">
              Bolsa
            </Link>
            <span>/</span>
            <span className="text-noir font-semibold">Finalizar Pedido</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start pb-16">

            {/* ── LEFT COLUMN ── */}
            <div className="lg:col-span-7 space-y-5">

              {/* Dark editorial panel */}
              <div className="bg-noir rounded-cowboy overflow-hidden relative">
                {/* grain overlay */}
                <div className="grain-overlay absolute inset-0 opacity-30 pointer-events-none" />

                <div className="relative z-10 p-7 sm:p-9 space-y-6">

                  {/* Display headline */}
                  <div>
                    <p className="text-[10px] uppercase tracking-luxury text-white/45 font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-wine" />
                      Checkout Directo
                    </p>
                    <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[2.6rem] font-normal leading-[1.08] tracking-tight text-white">
                      Tu pedido, <br />
                      <span className="italic text-white/80">
                        en minutos por WhatsApp
                      </span>
                    </h1>
                    <p className="text-xs text-white/55 mt-3 leading-relaxed max-w-md">
                      Sin formularios complicados. Confirma tu pedido, acuerda
                      el método de pago y programa tu envío a cualquier punto de
                      República Dominicana — todo en un chat.
                    </p>
                  </div>

                  {/* Optional personalization fields */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-medium text-white/60 uppercase tracking-wider">
                      Personaliza tu mensaje{" "}
                      <span className="normal-case font-normal text-white/35">
                        (opcional)
                      </span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="customer_name"
                          className="block text-[11px] text-white/50 mb-1"
                        >
                          Tu Nombre
                        </label>
                        <input
                          id="customer_name"
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ej: Carlos Pérez"
                          className="w-full px-4 py-2.5 bg-white/8 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-white/40 focus:bg-white/12 transition-all"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="customer_city"
                          className="block text-[11px] text-white/50 mb-1"
                        >
                          Ciudad o Sector
                        </label>
                        <input
                          id="customer_city"
                          type="text"
                          value={customerCity}
                          onChange={(e) => setCustomerCity(e.target.value)}
                          placeholder="Ej: Santo Domingo, Piantini"
                          className="w-full px-4 py-2.5 bg-white/8 border border-white/15 rounded-xl text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-white/40 focus:bg-white/12 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <button
                    type="button"
                    onClick={() => handleWhatsAppCheckout()}
                    disabled={isRedirecting}
                    className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] cursor-pointer group disabled:opacity-70"
                  >
                    <MessageCircle className="w-5 h-5 fill-white/20 transition-transform group-hover:scale-110" />
                    <span>
                      {isRedirecting
                        ? "Abriendo WhatsApp..."
                        : "Completar Pedido por WhatsApp"}
                    </span>
                    <span className="font-price font-bold bg-white/15 px-2.5 py-0.5 rounded-full text-xs ml-1">
                      {formatPrice(subtotal)}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <p className="text-[11px] text-center text-white/35 leading-relaxed">
                    Al pulsar se abre WhatsApp con el resumen de tus fragancias
                    listo para enviar al asesor oficial de A&amp;D Parfum.
                  </p>
                </div>
              </div>

              {/* Service benefit cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: Clock,
                    title: "Respuesta Rápida",
                    text: "Atención humana inmediata para resolver cualquier duda.",
                  },
                  {
                    icon: Truck,
                    title: "Envíos a Todo RD",
                    text: "Santo Domingo, Santiago, Punta Cana y todas las provincias.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Pago Flexible",
                    text: "Efectivo contra entrega o transferencias (Banreservas / BHD / Popular).",
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="bg-white p-4 rounded-xl border border-border space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 text-wine">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-bold text-noir">
                        {title}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray leading-snug">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT COLUMN: Order Summary ── */}
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

                {/* Items list */}
                <div className="divide-y divide-border/60 max-h-72 overflow-y-auto pr-1 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.variant_id}
                      className="pt-3 first:pt-0 flex items-center gap-3"
                    >
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

                {/* Price breakdown */}
                <div className="pt-4 border-t border-border space-y-2 text-xs text-gray">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-price font-semibold text-noir">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío República Dominicana</span>
                    <span className="text-emerald-700 font-medium">
                      A coordinar por WhatsApp
                    </span>
                  </div>
                </div>

                {/* Grand total */}
                <div className="pt-3 border-t border-border flex justify-between items-baseline">
                  <span className="text-sm font-medium text-noir">
                    Total a Pagar
                  </span>
                  <span className="font-price text-2xl font-bold text-noir">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* Secondary CTA */}
                <button
                  type="button"
                  onClick={() => handleWhatsAppCheckout()}
                  disabled={isRedirecting}
                  className="w-full py-3 px-4 rounded-full bg-noir hover:bg-wine text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Pedir directo por WhatsApp</span>
                </button>

                {/* Authenticity note */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-ivory border border-border">
                  <ShieldCheck className="w-4 h-4 text-wine flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray leading-relaxed">
                    Todos los frascos son{" "}
                    <span className="font-semibold text-noir">
                      100% originales y sellados
                    </span>
                    . Los decants se fraccionan estérilmente en atomizador de
                    cristal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
