"use client";

import React from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    freeShippingProgress,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-24 bg-porcelain">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-16 h-16 rounded-full bg-sand/30 flex items-center justify-center mx-auto mb-4 text-champagne border border-sand">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-editorial text-3xl font-normal text-espresso mb-2">
            Tu bolsa de compra está vacía
          </h1>
          <p className="text-xs sm:text-sm text-smoke mb-8 font-light">
            Explora nuestra colección de perfumes árabes o prueba un decant de 5ml o 10ml en atomizador de cristal de A&D Parfum.
          </p>
          <Link href="/perfumes" className="btn-gold text-xs">
            Explorar Catálogo A&D
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-porcelain">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="pb-8 border-b border-sand">
          <h1 className="heading-section text-espresso font-editorial">
            Bolsa de Compra A&D Parfum
          </h1>
          <p className="text-xs text-taupe mt-1 font-light">
            Revisa tus fragancias seleccionadas antes de proceder al checkout seguro.
          </p>
        </div>

        {/* Free Shipping Alert */}
        <div className="my-6 p-4 rounded-cowboy bg-sand/20 border border-sand text-xs">
          {freeShippingProgress.isFree ? (
            <p className="text-espresso font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-champagne inline-block animate-pulse" />
              <span>✨ ¡Felicidades! Tu orden cuenta con <strong>Envío Gratis</strong> en República Dominicana.</span>
            </p>
          ) : (
            <div>
              <p className="text-taupe mb-2 font-light">
                Agrega{" "}
                <strong className="text-espresso font-semibold">
                  {formatPrice(freeShippingProgress.needed)}
                </strong>{" "}
                más a tu bolsa para disfrutar de <strong>Envío Gratis</strong>.
              </p>
              <div className="w-full bg-sand rounded-full h-2 overflow-hidden">
                <div
                  className="bg-champagne h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress.percent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Items Table */}
          <div className="lg:col-span-8 divide-y divide-sand/70">
            {items.map((item) => (
              <div key={item.variant_id} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-24 rounded-cowboy overflow-hidden bg-sand/20 border border-sand flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-luxury text-taupe">{item.brand_name}</span>
                    <h3 className="font-editorial text-xl font-normal text-espresso">{item.product_name}</h3>
                    <p className="text-xs text-smoke font-light">{item.variant_name}</p>
                    <p className="text-xs font-bold text-espresso mt-1 sm:hidden">
                      {formatPrice(item.unit_price * item.quantity)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity */}
                  <div className="inline-flex items-center border border-sand rounded-full bg-sand/20 p-0.5">
                    <button
                      onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-graphite hover:text-espresso"
                      aria-label="Disminuir"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-espresso">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                      disabled={item.quantity >= item.max_stock}
                      className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-graphite hover:text-espresso disabled:opacity-30"
                      aria-label="Aumentar"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right hidden sm:block w-28">
                    <p className="text-sm font-bold text-espresso">
                      {formatPrice(item.unit_price * item.quantity)}
                    </p>
                    <p className="text-[10px] text-taupe font-light">
                      {formatPrice(item.unit_price)} c/u
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.variant_id)}
                    className="p-2 text-taupe hover:text-red-700 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-cowboy border border-sand p-6 sm:p-8 space-y-4 sticky top-28 shadow-sm">
              <h2 className="font-editorial text-xl font-normal text-espresso pb-3 border-b border-sand">
                Resumen de Pedido
              </h2>

              <div className="space-y-2 text-xs text-graphite">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} productos)</span>
                  <span className="font-semibold text-espresso">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío República Dominicana</span>
                  <span>
                    {freeShippingProgress.isFree ? (
                      <span className="text-emerald-700 font-semibold">Gratis</span>
                    ) : (
                      "Calculado en checkout"
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-sand flex justify-between items-baseline">
                <span className="text-sm font-medium text-espresso">Total Estimado</span>
                <span className="text-2xl font-bold text-espresso">{formatPrice(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="btn-gold w-full py-4 text-xs font-semibold justify-center gap-2 group shadow-md"
              >
                <span>Proceder al Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <div className="pt-3 border-t border-sand space-y-2 text-[11px] text-taupe font-light">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-champagne" />
                  <span>Decants 100% auténticos en vidrio neutro</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-champagne" />
                  <span>Pago Contra Entrega o Transferencia Bancaria</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
