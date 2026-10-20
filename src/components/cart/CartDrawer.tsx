"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    freeShippingProgress,
  } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-porcelain border-l border-sand flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-sand flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <span className="font-editorial text-2xl font-normal tracking-tight text-espresso">
                Bolsa de Compra
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-sand/30 text-taupe font-semibold">
                {itemCount} {itemCount === 1 ? "fragancia" : "fragancias"}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 -mr-2 text-taupe hover:text-espresso hover:bg-sand/30 rounded-full transition-colors"
              aria-label="Cerrar bolsa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Strip */}
          <div className="bg-sand/20 px-6 py-3.5 border-b border-sand text-xs">
            {freeShippingProgress.isFree ? (
              <p className="text-espresso font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-champagne inline-block animate-pulse" />
                <span>¡Disfrutas de <strong>Envío Gratis Nacional</strong> con A&D Parfum!</span>
              </p>
            ) : (
              <div>
                <p className="text-taupe mb-1.5 font-light">
                  Agrega{" "}
                  <span className="font-semibold text-espresso">
                    {formatPrice(freeShippingProgress.needed)}
                  </span>{" "}
                  más para obtener <strong className="text-espresso font-semibold">Envío Gratis</strong>
                </p>
                <div className="w-full bg-sand rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-champagne h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress.percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-sand/70">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-sand/30 flex items-center justify-center mb-4 text-champagne border border-sand">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-editorial text-2xl font-normal text-espresso mb-2">
                  Tu bolsa está vacía
                </h3>
                <p className="text-xs text-smoke max-w-xs mb-6 font-light">
                  Descubre los perfumes árabes más elogiados o prueba una muestra fraccionada antes de adquirir la botella completa.
                </p>
                <Link
                  href="/perfumes"
                  onClick={closeCart}
                  className="btn-gold text-xs"
                >
                  Explorar Fragancias A&D
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.variant_id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-cowboy overflow-hidden bg-sand/20 border border-sand flex-shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-semibold tracking-luxury uppercase text-taupe">
                            {item.brand_name}
                          </p>
                          <h4 className="text-sm font-semibold text-espresso line-clamp-1">
                            {item.product_name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeItem(item.variant_id)}
                          className="text-taupe hover:text-red-700 p-1 transition-colors"
                          title="Eliminar fragancia"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-smoke mt-0.5 font-light">
                        {item.variant_name}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-sand rounded-full bg-white">
                        <button
                          onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-graphite hover:text-espresso rounded-l-full"
                          aria-label="Disminuir"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-espresso">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                          disabled={item.quantity >= item.max_stock}
                          className="w-7 h-7 flex items-center justify-center text-graphite hover:text-espresso rounded-r-full disabled:opacity-30"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-espresso">
                          {formatPrice(item.unit_price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-taupe font-light">
                            {formatPrice(item.unit_price)} c/u
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-sand bg-white space-y-4">
              <div className="space-y-1.5 text-xs text-graphite">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-espresso font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío nacional estimado</span>
                  <span>
                    {freeShippingProgress.isFree ? (
                      <span className="text-emerald-700 font-semibold">Gratis</span>
                    ) : (
                      "Calculado en checkout"
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-sand flex justify-between items-baseline">
                <span className="text-sm font-medium text-espresso">Total Estimado</span>
                <span className="text-xl font-bold text-espresso">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-gold w-full py-4 flex items-center justify-center gap-2 group shadow-lg"
              >
                <span>Proceder al Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <p className="text-[11px] text-center text-taupe font-light">
                Pago contra entrega o transferencia directa • Empaque sellado A&D Parfum
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
