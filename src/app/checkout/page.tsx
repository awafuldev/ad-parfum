"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Banknote,
  Building,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    itemCount,
    clearCart,
    freeShippingProgress,
  } = useCart();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    shipping_city: "Bogotá D.C.",
    shipping_department: "Cundinamarca",
    delivery_notes: "",
    shipping_method: "standard" as "standard" | "express" | "pickup",
    payment_method: "contra_entrega" as "contra_entrega" | "transferencia" | "online_card",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (items.length === 0) {
    return (
      <div className="py-24 bg-porcelain text-center">
        <div className="max-w-md mx-auto px-4">
          <ShoppingBag className="w-12 h-12 text-champagne mx-auto mb-4" />
          <h1 className="font-editorial text-3xl font-normal text-espresso mb-2">
            Tu bolsa está vacía
          </h1>
          <p className="text-xs text-smoke mb-6 font-light">
            Agrega al menos una fragancia o decant para acceder a la pantalla de pago seguro en A&D Parfum.
          </p>
          <Link href="/perfumes" className="btn-gold text-xs">
            Explorar Perfumes
          </Link>
        </div>
      </div>
    );
  }

  // Shipping calculation
  let shippingFee = 0;
  if (formData.shipping_method === "standard") {
    shippingFee = freeShippingProgress.isFree ? 0 : 15000;
  } else if (formData.shipping_method === "express") {
    shippingFee = 25000;
  } else {
    shippingFee = 0;
  }

  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.customer_name.trim()) {
      setErrorMessage("Por favor ingresa tu nombre completo.");
      return;
    }
    if (!formData.customer_phone.trim()) {
      setErrorMessage("Por favor ingresa tu número de WhatsApp para coordinar la entrega.");
      return;
    }
    if (!formData.shipping_address.trim()) {
      setErrorMessage("Por favor ingresa tu dirección de entrega detallada.");
      return;
    }
    if (!formData.shipping_city.trim()) {
      setErrorMessage("Por favor ingresa tu ciudad.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: items.map((i) => ({
            product_id: i.product_id,
            variant_id: i.variant_id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "No se pudo procesar el pedido.");
        setIsSubmitting(false);
        return;
      }

      // Order created successfully
      clearCart();
      router.push(`/order-confirmation/${data.order.id}`);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error de conexión al procesar el pedido. Intenta nuevamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-sand/15">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-8 border-b border-sand mb-8">
          <div className="flex items-center gap-2 text-xs text-taupe mb-2">
            <Link href="/cart" className="hover:text-espresso transition-colors">
              Bolsa de Compra
            </Link>
            <span>/</span>
            <span className="text-espresso font-medium">Finalizar Compra</span>
          </div>
          <h1 className="heading-section text-espresso font-editorial">
            Checkout de Pedido A&D Parfum
          </h1>
          <p className="text-xs text-taupe mt-1 font-light">
            Completa tus datos de despacho en Colombia. No requerimos registro previo de cuenta.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-cowboy bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Shipping & Payment Details */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* 1. Contact Info */}
              <div className="bg-white p-6 sm:p-8 rounded-cowboy border border-sand space-y-4 shadow-sm">
                <h2 className="font-editorial text-xl font-normal text-espresso flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-espresso text-champagne text-xs flex items-center justify-center font-sans font-bold">
                    1
                  </span>
                  <span>Datos de Contacto</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="Ej. Juan Pérez"
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      WhatsApp / Móvil (Para confirmación) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      placeholder="Ej. 300 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Correo Electrónico (Para envío de guía y recibo)
                    </label>
                    <input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-white p-6 sm:p-8 rounded-cowboy border border-sand space-y-4 shadow-sm">
                <h2 className="font-editorial text-xl font-normal text-espresso flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-espresso text-champagne text-xs flex items-center justify-center font-sans font-bold">
                    2
                  </span>
                  <span>Dirección de Despacho en Colombia</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Dirección Completa (Calle / Carrera / Apto / Torre) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shipping_address}
                      onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                      placeholder="Ej. Calle 127 #15-30, Apto 402"
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Ciudad o Municipio *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shipping_city}
                      onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
                      placeholder="Ej. Bogotá, Medellín, Cali..."
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Departamento *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shipping_department}
                      onChange={(e) => setFormData({ ...formData, shipping_department: e.target.value })}
                      placeholder="Ej. Cundinamarca, Antioquia..."
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Instrucciones de entrega para el mensajero (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.delivery_notes}
                      onChange={(e) => setFormData({ ...formData, delivery_notes: e.target.value })}
                      placeholder="Ej. Dejar en portería o llamar antes de entregar"
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>
                </div>

                {/* Shipping Method Choice */}
                <div className="pt-4 border-t border-sand space-y-2">
                  <span className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-2">
                    Modalidad de Despacho
                  </span>

                  <label
                    className={`p-3.5 rounded-cowboy border flex items-center justify-between cursor-pointer transition-all ${
                      formData.shipping_method === "standard"
                        ? "border-champagne bg-sand/20 ring-1 ring-champagne"
                        : "border-sand"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={formData.shipping_method === "standard"}
                        onChange={() => setFormData({ ...formData, shipping_method: "standard" })}
                        className="text-espresso focus:ring-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-espresso">Envío Estándar Nacional (2-4 días hábiles)</p>
                        <p className="text-[11px] text-taupe font-light">Servientrega / Interrapidísimo con guía de rastreo</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-espresso">
                      {freeShippingProgress.isFree ? "Gratis" : formatPrice(15000)}
                    </span>
                  </label>

                  <label
                    className={`p-3.5 rounded-cowboy border flex items-center justify-between cursor-pointer transition-all ${
                      formData.shipping_method === "express"
                        ? "border-champagne bg-sand/20 ring-1 ring-champagne"
                        : "border-sand"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={formData.shipping_method === "express"}
                        onChange={() => setFormData({ ...formData, shipping_method: "express" })}
                        className="text-espresso focus:ring-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-espresso">Envío Express Prioritario (24-48 horas)</p>
                        <p className="text-[11px] text-taupe font-light">Despacho en primer turno de mensajería</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-espresso">
                      {formatPrice(25000)}
                    </span>
                  </label>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white p-6 sm:p-8 rounded-cowboy border border-sand space-y-4 shadow-sm">
                <h2 className="font-editorial text-xl font-normal text-espresso flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-espresso text-champagne text-xs flex items-center justify-center font-sans font-bold">
                    3
                  </span>
                  <span>Método de Pago</span>
                </h2>

                <div className="space-y-3">
                  {/* Contra Entrega */}
                  <label
                    className={`p-4 rounded-cowboy border flex items-start gap-3 cursor-pointer transition-all ${
                      formData.payment_method === "contra_entrega"
                        ? "border-champagne bg-sand/20 ring-1 ring-champagne"
                        : "border-sand"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.payment_method === "contra_entrega"}
                      onChange={() => setFormData({ ...formData, payment_method: "contra_entrega" })}
                      className="mt-0.5 text-espresso focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-champagne" />
                        <span className="text-xs font-semibold text-espresso">
                          Pago Contra Entrega (Efectivo o Transferencia al recibir)
                        </span>
                      </div>
                      <p className="text-[11px] text-smoke mt-1 leading-relaxed font-light">
                        Paga únicamente cuando la transportadora entregue el paquete sellado en tu domicilio. Máxima tranquilidad con A&D Parfum.
                      </p>
                    </div>
                  </label>

                  {/* Transferencia Bancaria */}
                  <label
                    className={`p-4 rounded-cowboy border flex items-start gap-3 cursor-pointer transition-all ${
                      formData.payment_method === "transferencia"
                        ? "border-champagne bg-sand/20 ring-1 ring-champagne"
                        : "border-sand"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.payment_method === "transferencia"}
                      onChange={() => setFormData({ ...formData, payment_method: "transferencia" })}
                      className="mt-0.5 text-espresso focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-champagne" />
                        <span className="text-xs font-semibold text-espresso">
                          Transferencia Bancaria Directa (Bancolombia, Nequi, Daviplata)
                        </span>
                      </div>
                      <p className="text-[11px] text-smoke mt-1 leading-relaxed font-light">
                        Te enviaremos los datos de cuenta inmediatamente tras confirmar la orden para transferir sin comisiones adicionales.
                      </p>
                    </div>
                  </label>

                  {/* Tarjeta de Crédito */}
                  <label
                    className={`p-4 rounded-cowboy border flex items-start gap-3 cursor-pointer transition-all ${
                      formData.payment_method === "online_card"
                        ? "border-champagne bg-sand/20 ring-1 ring-champagne"
                        : "border-sand"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.payment_method === "online_card"}
                      onChange={() => setFormData({ ...formData, payment_method: "online_card" })}
                      className="mt-0.5 text-espresso focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-champagne" />
                        <span className="text-xs font-semibold text-espresso">
                          Tarjeta de Crédito / PSE (Wompi / PayU Sandbox)
                        </span>
                      </div>
                      <p className="text-[11px] text-smoke mt-1 leading-relaxed font-light">
                        Pasarela encriptada tokenizada. Pago simulado en modo seguro de prueba.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right: Order Summary Snapshot */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 sm:p-8 rounded-cowboy border border-sand space-y-6 sticky top-28 shadow-sm">
                <div className="pb-4 border-b border-sand flex items-center justify-between">
                  <h2 className="font-editorial text-xl font-normal text-espresso">
                    Resumen de Compra
                  </h2>
                  <span className="text-xs text-taupe font-medium">
                    {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
                  </span>
                </div>

                {/* Items preview list */}
                <div className="divide-y divide-sand/70 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.variant_id} className="py-3 flex gap-3 items-center">
                      <div className="w-12 h-14 rounded-cowboy bg-sand/20 overflow-hidden border border-sand flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-taupe uppercase font-semibold tracking-luxury">{item.brand_name}</p>
                        <p className="text-xs font-semibold text-espresso truncate">{item.product_name}</p>
                        <p className="text-[11px] text-smoke font-light">{item.variant_name} x {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-espresso">
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cost lines */}
                <div className="space-y-2 pt-2 border-t border-sand text-xs text-graphite">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-espresso font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costo de despacho</span>
                    <span className="text-espresso font-semibold">
                      {shippingFee === 0 ? "Gratis" : formatPrice(shippingFee)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-sand flex justify-between items-baseline">
                  <span className="text-sm font-medium text-espresso">Total a Liquidar</span>
                  <span className="text-2xl font-bold text-espresso">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold w-full py-4 text-xs font-bold tracking-wider uppercase justify-center gap-2 group disabled:opacity-50 shadow-lg"
                >
                  {isSubmitting ? (
                    <span>Procesando Pedido...</span>
                  ) : (
                    <>
                      <span>Confirmar Pedido • {formatPrice(grandTotal)}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-taupe leading-relaxed font-light">
                  Al confirmar, recibirás tu código oficial <strong className="text-espresso">AD-2026-XXXX</strong> y podrás solicitar confirmación directa por WhatsApp.
                </p>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
