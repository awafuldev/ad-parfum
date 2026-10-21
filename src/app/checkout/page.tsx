"use client";

import React, { useState, useEffect } from "react";
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
  Truck,
  MapPin,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";
import { StoreSettings } from "@/types";

const DOMINICAN_PROVINCES = [
  "Distrito Nacional",
  "Santo Domingo",
  "Santiago",
  "La Altagracia (Punta Cana / Higüey)",
  "La Romana",
  "La Vega",
  "Puerto Plata",
  "San Cristóbal",
  "Duarte (San Francisco de Macorís)",
  "Espaillat (Moca)",
  "San Pedro de Macorís",
  "Azua",
  "Barahona",
  "Monseñor Nouel (Bonao)",
  "Peravia (Baní)",
  "Sánchez Ramírez (Cotui)",
  "Valverde (Mao)",
  "Otras Provincias (Nivel Nacional)",
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    itemCount,
    clearCart,
    freeShippingProgress,
  } = useCart();

  const [settings, setSettings] = useState<StoreSettings | null>(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_department: "Distrito Nacional", // Provincia
    shipping_city: "Santo Domingo de Guzmán", // Municipio / Ciudad
    shipping_sector: "", // Sector / Barrio
    shipping_address: "", // Calle, Número, Apto
    delivery_notes: "",
    shipping_method: "standard" as "standard" | "express" | "pickup",
    payment_method: "contra_entrega" as "contra_entrega" | "transferencia" | "online_card",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load store settings
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {});
  }, []);

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

  // Shipping calculation based on configured settings
  const standardFee = settings ? settings.standard_shipping_fee : 0;
  const expressFee = settings ? settings.express_shipping_fee : 0;

  let shippingFee = 0;
  if (formData.shipping_method === "standard") {
    shippingFee = freeShippingProgress.isFree ? 0 : standardFee;
  } else if (formData.shipping_method === "express") {
    shippingFee = expressFee;
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
      setErrorMessage("Por favor ingresa tu número de WhatsApp o teléfono en República Dominicana.");
      return;
    }
    if (!formData.shipping_address.trim()) {
      setErrorMessage("Por favor ingresa tu calle, número de casa/edificio o apartamento.");
      return;
    }
    if (!formData.shipping_city.trim()) {
      setErrorMessage("Por favor ingresa tu municipio o ciudad.");
      return;
    }

    setIsSubmitting(true);

    // Build consolidated full address including Sector
    const consolidatedAddress = formData.shipping_sector.trim()
      ? `${formData.shipping_address.trim()}, Sector ${formData.shipping_sector.trim()}`
      : formData.shipping_address.trim();

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.customer_name.trim(),
          customer_email: formData.customer_email.trim(),
          customer_phone: formData.customer_phone.trim(),
          shipping_address: consolidatedAddress,
          shipping_city: formData.shipping_city.trim(),
          shipping_department: formData.shipping_department,
          delivery_notes: formData.delivery_notes.trim(),
          shipping_method: formData.shipping_method,
          payment_method: formData.payment_method,
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
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-12">
        
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
            Despachos a todo el territorio de la República Dominicana. No requieres cuenta previa para comprar.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-cowboy bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 shadow-sm">
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
                  <span>Datos del Cliente</span>
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
                      placeholder="Ej. Carlos Almonte"
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Teléfono / WhatsApp (Rep. Dominicana) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      placeholder="Ej. (809) 555-0123 / 829 / 849"
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Correo Electrónico (Para confirmación y recibo digital)
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

              {/* 2. Delivery Address in Dominican Republic */}
              <div className="bg-white p-6 sm:p-8 rounded-cowboy border border-sand space-y-4 shadow-sm">
                <h2 className="font-editorial text-xl font-normal text-espresso flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-espresso text-champagne text-xs flex items-center justify-center font-sans font-bold">
                    2
                  </span>
                  <span>Dirección de Entrega en República Dominicana</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Provincia */}
                  <div>
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Provincia *
                    </label>
                    <select
                      value={formData.shipping_department}
                      onChange={(e) => setFormData({ ...formData, shipping_department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10 cursor-pointer"
                    >
                      {DOMINICAN_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Municipio o Ciudad */}
                  <div>
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Municipio o Ciudad *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shipping_city}
                      onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
                      placeholder="Ej. Santo Domingo, Santiago, Higüey..."
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>

                  {/* Sector / Barrio */}
                  <div>
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Sector o Barrio
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_sector}
                      onChange={(e) => setFormData({ ...formData, shipping_sector: e.target.value })}
                      placeholder="Ej. Piantini, Naco, Bella Vista, Gurabo..."
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>

                  {/* Calle y Número */}
                  <div>
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Calle, Edificio / Residencial y No. Apto *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shipping_address}
                      onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                      placeholder="Ej. Av. Winston Churchill No. 109, Torre 2, Apto 5B"
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-1">
                      Instrucciones adicionales para la entrega (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.delivery_notes}
                      onChange={(e) => setFormData({ ...formData, delivery_notes: e.target.value })}
                      placeholder="Ej. Entregar en recepción o llamar al llegar"
                      className="w-full px-3.5 py-2.5 rounded-cowboy border border-sand text-xs text-espresso focus:outline-none focus:border-espresso bg-sand/10"
                    />
                  </div>

                </div>

                {/* Shipping Method Choice */}
                <div className="pt-4 border-t border-sand space-y-2">
                  <span className="text-[10px] font-semibold text-espresso uppercase tracking-wider block mb-2">
                    Modalidad de Envío
                  </span>

                  <label
                    className={`p-3.5 rounded-cowboy border flex items-center justify-between cursor-pointer transition-all ${
                      formData.shipping_method === "standard"
                        ? "border-champagne bg-sand/20 ring-1 ring-champagne"
                        : "border-sand hover:bg-sand/10"
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
                        <p className="text-xs font-semibold text-espresso">
                          Envío Estándar Nacional (República Dominicana)
                        </p>
                        <p className="text-[11px] text-taupe font-light">
                          Coordinado mediante mensajería local / transporte nacional con confirmación de entrega
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-espresso">
                      {standardFee === 0 || freeShippingProgress.isFree ? "A coordinar" : formatPrice(standardFee)}
                    </span>
                  </label>

                  <label
                    className={`p-3.5 rounded-cowboy border flex items-center justify-between cursor-pointer transition-all ${
                      formData.shipping_method === "pickup"
                        ? "border-champagne bg-sand/20 ring-1 ring-champagne"
                        : "border-sand hover:bg-sand/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={formData.shipping_method === "pickup"}
                        onChange={() => setFormData({ ...formData, shipping_method: "pickup" })}
                        className="text-espresso focus:ring-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-espresso">
                          Retiro Personal / Coordinar Entrega Directa
                        </p>
                        <p className="text-[11px] text-taupe font-light">
                          Punto de encuentro o coordinación directa previa por WhatsApp
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-espresso">Gratis</span>
                  </label>
                </div>

              </div>

              {/* 3. Payment Method for Dominican Republic */}
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
                        : "border-sand hover:bg-sand/10"
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
                          Pago Contra Entrega (Efectivo al recibir)
                        </span>
                      </div>
                      <p className="text-[11px] text-smoke mt-1 leading-relaxed font-light">
                        Paga en efectivo al mensajero únicamente al recibir el paquete sellado. Disponible para entregas en Santo Domingo y zonas coordinadas.
                      </p>
                    </div>
                  </label>

                  {/* Transferencia Bancaria Directa */}
                  <label
                    className={`p-4 rounded-cowboy border flex items-start gap-3 cursor-pointer transition-all ${
                      formData.payment_method === "transferencia"
                        ? "border-champagne bg-sand/20 ring-1 ring-champagne"
                        : "border-sand hover:bg-sand/10"
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
                          Transferencia Bancaria Directa (Bancos en RD)
                        </span>
                      </div>
                      <p className="text-[11px] text-smoke mt-1 leading-relaxed font-light">
                        Cuentas disponibles en <strong>Banreservas, Banco BHD y Banco Popular Dominicano</strong>. Te suministraremos los números de cuenta oficiales al confirmar la orden.
                      </p>
                    </div>
                  </label>

                  {/* Tarjeta de Crédito */}
                  <label
                    className={`p-4 rounded-cowboy border flex items-start gap-3 cursor-pointer transition-all opacity-85 ${
                      formData.payment_method === "online_card"
                        ? "border-champagne bg-sand/20 ring-1 ring-champagne"
                        : "border-sand hover:bg-sand/10"
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
                          Tarjeta de Crédito / Débito (Enlace de Pago)
                        </span>
                        <span className="text-[10px] text-taupe px-2 py-0.5 rounded bg-sand/30 border border-sand">
                          Coordinado
                        </span>
                      </div>
                      <p className="text-[11px] text-smoke mt-1 leading-relaxed font-light">
                        Te enviaremos un enlace de pago seguro a través de WhatsApp para completar tu compra con tarjeta Visa o Mastercard.
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

                {/* Cost lines in DOP */}
                <div className="space-y-2 pt-2 border-t border-sand text-xs text-graphite">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-espresso font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span className="text-espresso font-semibold">
                      {shippingFee === 0 ? "A coordinar" : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-taupe">
                    <span>Moneda oficial</span>
                    <span>Pesos Dominicanos (DOP)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-sand flex justify-between items-baseline">
                  <span className="text-base font-medium text-espresso">Total del Pedido</span>
                  <span className="text-2xl font-bold text-espresso">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold w-full py-4 text-xs font-bold tracking-wide justify-center shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registrando Pedido...</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Confirmar Pedido • {formatPrice(grandTotal)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>

                {/* Trust and Authenticity Note */}
                <div className="space-y-2 pt-2 text-[11px] text-smoke leading-relaxed border-t border-sand/60">
                  <p className="flex items-center gap-1.5 text-espresso font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                    <span>A&D Parfum — Garantía de autenticidad en República Dominicana</span>
                  </p>
                  <p className="font-light">
                    Al confirmar, recibirás tu número de referencia único y podrás coordinar la entrega directamente con nosotros.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
