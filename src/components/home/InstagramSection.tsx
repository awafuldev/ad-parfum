"use client";

import React from "react";
import Link from "next/link";
import { Instagram, ArrowUpRight, Play, Heart } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/motion/RevealOnScroll";

export function InstagramSection() {
  const posts = [
    {
      id: "post-1",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
      caption: "¿Khamrah o Qahwa? Análisis de rendimiento y café especiado en piel.",
      tag: "Reseña Árabe",
    },
    {
      id: "post-2",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
      caption: "Hawas vs Hawas Ice: ¿Cuál proyecta más en climas cálidos?",
      tag: "Modo Bestia",
    },
    {
      id: "post-3",
      image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
      caption: "Guía de decants: cuántas atomizaciones rinde un frasco de 5ml y 10ml.",
      tag: "Guía de Decants",
    },
    {
      id: "post-4",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
      caption: "Top 3 perfumes para salidas nocturnas que nunca fallan.",
      tag: "Top Elogios",
    },
  ];

  return (
    <section className="py-28 bg-porcelain border-b border-sand/70 grain-overlay relative">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <RevealOnScroll direction="up" delayMs={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-champagne font-semibold mb-2.5">
                <Instagram className="w-3.5 h-3.5" />
                <span>Comunidad Olfativa</span>
              </div>
              <h2 className="heading-section text-espresso font-editorial">
                Sigue la Conversación en @adparfum
              </h2>
              <p className="text-xs sm:text-sm text-taupe mt-1 font-light">
                Unboxings, primeras impresiones, pruebas de fijación en vivo y debates con amantes del aroma.
              </p>
            </div>

            <Link
              href="https://www.instagram.com/adparfum/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs group"
            >
              <span>Ver Instagram Oficial</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-champagne transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </RevealOnScroll>

        {/* Visual Social Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {posts.map((post, idx) => (
            <RevealOnScroll
              key={post.id}
              direction="up"
              delayMs={idx * 70}
              className="h-full"
            >
              <Link
                href="https://www.instagram.com/adparfum/"
                target="_blank"
                rel="noopener noreferrer"
                className="group aspect-[4/5] rounded-cowboy overflow-hidden bg-espresso border border-sand relative flex flex-col justify-end p-5 transition-all duration-700 hover:border-espresso hover:shadow-2xl glass-sheen block"
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.caption}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-900 ease-out group-hover:scale-108 filter brightness-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent" />

                {/* Tag */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="bg-porcelain/90 backdrop-blur-sm text-espresso text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-sand">
                    {post.tag}
                  </span>
                </div>

                <div className="absolute top-3.5 right-3.5 text-porcelain opacity-80 group-hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4 fill-porcelain" />
                </div>

                {/* Caption */}
                <div className="relative z-10 text-porcelain space-y-1.5">
                  <p className="text-xs font-normal line-clamp-2 leading-snug font-light">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-champagne">
                    <Heart className="w-3 h-3 fill-champagne/40" />
                    <span>Ver en Instagram</span>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
