import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  MessageCircle,
  Building,
  Sparkles,
} from "lucide-react";
import { getOrderById, getStoreSettings } from "@/lib/storage";
import { buildWhatsAppOrderUrl, formatDate, formatPrice } from "@/lib/formatters";

export const dynamic = "force-dynamic";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const order = await getOrderById(params.id);
  const settings = await getStoreSettings();

  if (!order) {
    notFound();
  }

  const whatsappUrl = buildWhatsAppOrderUrl(order, settings.whatsapp_number);

  return (
    <div className="py-16 bg-porcelain min-h-[85vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Success Banner */}
        <div className="bg-white rounded-cowboy border border-sand p-8 sm:p-12 text-center space-y-4 mb-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-sand/30 text-champagne-dark flex items-center justify-center mx-auto mb-2 border border-champagne/40">
            <CheckCircle2 className="w-8 h-8 text-champagne" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-luxury text-champagne bg-espresso px-3.5 py-1 rounded-full border border-champagne/30">
            Pedido Confirmado • A&D Parfum
          </span>

          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-espresso">
            ¡Gracias por tu compra, {order.customer_name.split(" ")[0]}!
          </h1>

          <p className="text-xs sm:text-sm text-smoke max-w-lg mx-auto leading-relaxed font-light">
            Hemos recibido tu orden y hemos reservado tus fragancias en inventario. Tu número de referencia oficial es:
          </p>

          <div className="inline-block bg-sand/20 border border-sand px-6 py-3 rounded-cowboy text-lg font-mono font-bold text-espresso tracking-wider">
            {order.reference}
          </div>

          {/* Direct WhatsApp Confirmation Trigger */}
          <div className="pt-6 border-t border-sand flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full sm:w-auto text-xs py-3.5 px-6 flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirmar Pedido por WhatsApp</span>
            </Link>

            <Link
              href="/perfumes"
              className="btn-secondary text-xs py-3.5 px-6 w-full sm:w-auto"
            >
              Seguir Explorando Fragancias
            </Link>
          </div>
        </div>

        {/* Payment Instructions Box */}
        {order.payment_method === "transferencia" && (
          <div className="bg-white rounded-cowboy border border-champagne/40 p-6 sm:p-8 mb-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-espresso font-semibold text-sm">
              <Building className="w-5 h-5 text-champagne" />
              <span>Instrucciones para Transferencia Bancaria</span>
            </div>
            <p className="text-xs text-smoke leading-relaxed font-light">
              Por favor realiza tu transferencia por el valor exacto de{" "}
              <strong className="font-price text-espresso font-bold">{formatPrice(order.total)}</strong>.
            </p>
            <div className="p-4 rounded-cowboy bg-sand/15 border border-champagne/30 text-xs space-y-2">
              <p className="font-semibold text-espresso">📲 Datos de cuenta bancaria (República Dominicana)</p>
              <p className="text-graphite leading-relaxed">
                Te enviaremos los datos de cuentas bancarias dominicanas por WhatsApp para completar tu pago.
                Por favor ten a mano tu número de referencia:
              </p>
              <p className="font-mono text-espresso font-bold tracking-widest">{order.reference}</p>
              <p className="text-[11px] text-taupe font-light">
                Bancos disponibles: Banreservas · BHD León · Banco Popular · Scotiabank · apap
              </p>
            </div>
          </div>
        )}

        {/* Order Details Breakdown Card */}
        <div className="bg-white rounded-cowboy border border-sand p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-sand">
            <h2 className="font-editorial text-2xl font-normal text-espresso">
              Detalle del Pedido
            </h2>
            <span className="text-xs text-taupe font-medium">{formatDate(order.created_at)}</span>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pb-6 border-b border-sand">
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-luxury text-taupe mb-1">Destinatario</p>
              <p className="font-semibold text-espresso">{order.customer_name}</p>
              <p className="text-smoke font-light">{order.customer_phone}</p>
              {order.customer_email && <p className="text-smoke font-light">{order.customer_email}</p>}
            </div>

            <div>
              <p className="text-[10px] uppercase font-semibold tracking-luxury text-taupe mb-1">Dirección de Despacho</p>
              <p className="font-semibold text-espresso">{order.shipping_address}</p>
              <p className="text-smoke font-light">{order.shipping_city}, {order.shipping_department}</p>
              {order.delivery_notes && (
                <p className="text-[11px] text-taupe italic mt-1 font-light">&quot;{order.delivery_notes}&quot;</p>
              )}
            </div>

            <div>
              <p className="text-[10px] uppercase font-semibold tracking-luxury text-taupe mb-1">Método de Despacho</p>
              <p className="font-medium text-espresso capitalize">
                {order.shipping_method === "standard"
                  ? "Envío Estándar Nacional (2-4 días)"
                  : order.shipping_method === "express"
                  ? "Envío Express Prioritario (24-48h)"
                  : "Recogida Local"}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-semibold tracking-luxury text-taupe mb-1">Forma de Pago</p>
              <p className="font-medium text-espresso">
                {order.payment_method === "contra_entrega"
                  ? "Contra Entrega (Efectivo o Transferencia al recibir)"
                  : order.payment_method === "transferencia"
                  ? "Transferencia Bancaria Directa"
                  : "Tarjeta de Crédito / PSE en línea"}
              </p>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                order.payment_status === "paid" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
              }`}>
                {order.payment_status === "paid" ? "Pagado" : "Pendiente de Pago"}
              </span>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="divide-y divide-sand/70">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-16 rounded-cowboy bg-sand/20 overflow-hidden border border-sand flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-semibold tracking-luxury text-taupe">{item.brand_name}</p>
                    <h4 className="font-editorial text-lg font-normal text-espresso">{item.product_name}</h4>
                    <p className="text-xs text-smoke font-light">{item.variant_name} x {item.quantity}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-price text-xs font-bold text-espresso">{formatPrice(item.total_price)}</p>
                  <p className="font-price text-[10px] text-taupe font-normal">{formatPrice(item.unit_price)} c/u</p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="pt-4 border-t border-sand space-y-2 text-xs text-graphite">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-price font-semibold text-espresso">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Costo de Despacho</span>
              <span className="font-price font-semibold text-espresso">
                {order.shipping_fee === 0 ? "Gratis" : formatPrice(order.shipping_fee)}
              </span>
            </div>
            <div className="pt-2 border-t border-sand flex justify-between items-baseline">
              <span className="text-sm font-semibold text-espresso">Total Liquidado</span>
              <span className="font-price text-2xl font-bold text-espresso">{formatPrice(order.total)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
