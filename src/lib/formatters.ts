import { Order } from "@/types";

export function formatPrice(amount: number, currencySymbol: string = "$"): string {
  // Format as Colombian Pesos or local integer currency with thousands separators
  const formatted = new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${currencySymbol} ${formatted} COP`;
}

export function formatSimplePrice(amount: number, currencySymbol: string = "$"): string {
  return `${currencySymbol} ${new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return isoString;
  }
}

export function generateOrderReference(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `AD-${year}-${random}`;
}

export function buildWhatsAppOrderUrl(order: Order, whatsappNumber: string): string {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.product_name} (${item.variant_name}) x${item.quantity} = ${formatPrice(
          item.total_price
        )}`
    )
    .join("\n");

  const message = `✨ *NUEVO PEDIDO EN A&D PARFUM* ✨\n\n` +
    `*Referencia:* ${order.reference}\n` +
    `*Cliente:* ${order.customer_name}\n` +
    `*WhatsApp / Teléfono:* ${order.customer_phone}\n` +
    `*Ciudad:* ${order.shipping_city}, ${order.shipping_department}\n` +
    `*Dirección:* ${order.shipping_address}\n` +
    (order.delivery_notes ? `*Instrucciones:* ${order.delivery_notes}\n` : "") +
    `\n*DETALLE DE FRAGANCIAS:*\n${itemsText}\n\n` +
    `*Subtotal:* ${formatPrice(order.subtotal)}\n` +
    `*Envío:* ${formatPrice(order.shipping_fee)} (${order.shipping_method})\n` +
    `*TOTAL A PAGAR:* ${formatPrice(order.total)}\n` +
    `*Método de Pago:* ${order.payment_method === "contra_entrega" ? "Contra Entrega (Efectivo / Transferencia local)" : order.payment_method === "transferencia" ? "Transferencia Bancaria (Bancolombia / Nequi / Daviplata)" : "Pago en línea con Tarjeta"}\n\n` +
    `Por favor confírmenme los detalles de envío y disponibilidad. ¡Muchas gracias!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
