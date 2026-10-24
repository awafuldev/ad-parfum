"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/motion/RevealOnScroll";
import { GlassTiltCard } from "@/components/ui/motion/GlassTiltCard";

export function BrandStory() {
  return (
    <section className="py-28 bg-sand/30 border-b border-sand/70 grain-overlay relative">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Editorial Photographic Column with Floating Emblem Pill */}
          <div className="lg:col-span-5 relative">
            <RevealOnScroll direction="scale" delayMs={100}>
              <GlassTiltCard className="aspect-[3/4] rounded-cowboy overflow-hidden border border-sand shadow-2xl bg-espresso relative glass-sheen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85"
                  alt="Filosofía Fragance Stock RD y Decants de Cristal"
                  className="w-full h-full object-cover filter brightness-90 contrast-110 transition-transform duration-1000 ease-out hover:scale-105"
                />
              </GlassTiltCard>
            </RevealOnScroll>
            
            {/* Minimalist Floating Overlay Pill in Deep Espresso */}
            <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:right-6 bg-espresso/95 backdrop-blur-xl text-porcelain p-6 rounded-cowboy shadow-2xl max-w-xs border border-champagne/30 z-20 animate-ambientFloat">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
                <p className="text-[10px] uppercase tracking-luxury text-champagne font-semibold">
                  Sello Fragance Stock RD
                </p>
              </div>
              <p className="font-editorial text-base italic font-light leading-snug">
                &quot;El perfume no se compra a ciegas; se vive y se transforma en la propia piel.&quot;
              </p>
            </div>
          </div>

          {/* Story Text */}
          <div className="lg:col-span-7 space-y-6">
            <RevealOnScroll direction="up" delayMs={50}>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-champagne font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Filosofía & Decantación Artesanal</span>
              </div>

              <h2 className="heading-section text-espresso font-editorial leading-tight">
                Democratizando la Alta Perfumería de Medio Oriente
              </h2>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delayMs={120}>
              <div className="space-y-4 text-sm text-smoke leading-relaxed font-light">
                <p>
                  En <strong>Fragance Stock RD</strong> nacemos de la pasión por desmitificar el universo de las fragancias árabes y los elixires de autor. Durante años, adquirir un perfume representaba un riesgo económico elevado al depender de compras a ciegas o referencias publicitarias ajenas a la química real de cada piel.
                </p>
                <p>
                  Nuestra propuesta combina un servicio riguroso de decants fraccionados en formatos portátiles de 5ml y 10ml, además de botellas originales selladas de fábrica en sus cajas oficiales.
                </p>
                <p>
                  Cada muestra se extrae directamente de frascos genuinos utilizando instrumentos estériles de vidrio neutro y atomizadores de rosca que garantizan exactamente la misma concentración, sillage y fijación que la botella completa.
                </p>
              </div>
            </RevealOnScroll>

            {/* Checklist */}
            <RevealOnScroll direction="up" delayMs={180}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs text-espresso font-medium">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-champagne flex-shrink-0" />
                  <span>Extracción manual limpia en vidrio neutro</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-champagne flex-shrink-0" />
                  <span>Atomizadores de bruma ultra homogénea</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-champagne flex-shrink-0" />
                  <span>Etiquetado claro con notas y concentración</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-champagne flex-shrink-0" />
                  <span>Empaque sellado a prueba de fugas</span>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delayMs={220}>
              <div className="pt-4">
                <Link
                  href="/perfumes?category=cat-decants"
                  className="btn-primary text-xs group"
                >
                  <span>Descubrir Colección de Decants</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </RevealOnScroll>

          </div>

        </div>
      </div>
    </section>
  );
}
