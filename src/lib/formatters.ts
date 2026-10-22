import { Order } from "@/types";

/**
 * Format monetary amount in Dominican Pesos (DOP).
 * Centralized formatter using 'es-DO' locale and 'RD$' currency symbol.
 * Uses integer rounding (no decimals) for fragrance prices.
 */
export function formatPrice(amount: number, currencySymbol: string = "RD$"): string {
  const safeAmount = Math.round(Number(amount) || 0);
  const formatted = new Intl.NumberFormat("es-DO", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(safeAmount);
  return `${currencySymbol} ${formatted}`;
}

export function formatSimplePrice(amount: number, currencySymbol: string = "RD$"): string {
  return formatPrice(amount, currencySymbol);
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("es-DO", {
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

/**
 * Builds official WhatsApp order message for Dominican market.
 * Omits wa.me link generation if no phone is configured in the admin.
 */
export function buildWhatsAppOrderUrl(order: Order, whatsappNumber?: string): string {
  if (!whatsappNumber || !whatsappNumber.trim()) {
    return "";
  }

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
  if (!cleanPhone) return "";

  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.product_name} (${item.variant_name}) x${item.quantity} = ${formatPrice(
          item.total_price
        )}`
    )
    .join("\n");

  const shippingLocation = [order.shipping_city, order.shipping_department]
    .filter(Boolean)
    .join(", ");

  const paymentMethodLabel =
    order.payment_method === "contra_entrega"
      ? "Pago Contra Entrega (Efectivo al recibir)"
      : order.payment_method === "transferencia"
      ? "Transferencia Bancaria Directa (Banreservas / Banco BHD / Banco Popular)"
      : "Pago con Tarjeta de Crédito / Débito";

  const message =
    `*NUEVO PEDIDO — A&D PARFUM*\n\n` +
    `*Referencia:* ${order.reference}\n` +
    `*Cliente:* ${order.customer_name}\n` +
    `*Teléfono / WhatsApp:* ${order.customer_phone}\n` +
    `*Destino:* ${shippingLocation}\n` +
    `*Dirección:* ${order.shipping_address}\n` +
    (order.delivery_notes ? `*Instrucciones:* ${order.delivery_notes}\n` : "") +
    `\n*DETALLE DEL PEDIDO:*\n${itemsText}\n\n` +
    `*Subtotal:* ${formatPrice(order.subtotal)}\n` +
    `*Envío:* ${order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : "A coordinar / Incluido"}\n` +
    `*TOTAL A PAGAR:* ${formatPrice(order.total)}\n` +
    `*Método de Pago:* ${paymentMethodLabel}\n\n` +
    `Por favor confírmenme la disponibilidad y la coordinación de entrega. ¡Muchas gracias!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export interface CartItemLike {
  product_name: string;
  variant_name: string;
  quantity: number;
  unit_price: number;
}

/**
 * Builds direct WhatsApp checkout URL from active cart items.
 * Defaults to Dominican official contact number +1 (829) 375-1717.
 */
export function buildWhatsAppCartUrl(
  items: CartItemLike[],
  subtotal: number,
  customerName?: string,
  customerCity?: string,
  whatsappNumber: string = "18293751717"
): string {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "") || "18293751717";

  const itemsText = items
    .map(
      (item) =>
        `• ${item.product_name} (${item.variant_name}) x${item.quantity} = ${formatPrice(
          item.unit_price * item.quantity
        )}`
    )
    .join("\n");

  const customerInfo = [
    customerName?.trim() ? `*Cliente:* ${customerName.trim()}` : "",
    customerCity?.trim() ? `*Destino:* ${customerCity.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const message =
    `*PEDIDO A&D PARFUM — REPÚBLICA DOMINICANA*\n\n` +
    (customerInfo ? `${customerInfo}\n\n` : "") +
    `*FRAGANCIAS SOLICITADAS:*\n` +
    `${itemsText}\n\n` +
    `*TOTAL ESTIMADO:* ${formatPrice(subtotal)}\n` +
    `*Envío:* A coordinar para toda República Dominicana\n\n` +
    `¡Hola! Deseo ordenar estas fragancias con entrega en República Dominicana. ¿Me confirman disponibilidad y los pasos para el pago y despacho?`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
