import React from "react";
import Link from "next/link";
import { Instagram, MessageCircle, ArrowUpRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-espresso text-porcelain pt-20 pb-12 border-t border-espresso">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Strip with Warm Champagne & Sand Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-sand/15 text-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-sand/10 border border-champagne/30 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-champagne" />
            </div>
            <div>
              <h4 className="font-editorial text-base text-porcelain font-medium mb-1">Envíos Asegurados a Toda Colombia</h4>
              <p className="text-sand/70 leading-relaxed">
                Despachos diarios a Bogotá, Medellín, Cali, Barranquilla y principales ciudades con guía oficial de rastreo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-sand/10 border border-champagne/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-champagne" />
            </div>
            <div>
              <h4 className="font-editorial text-base text-porcelain font-medium mb-1">Garantía de Decantación Genuina</h4>
              <p className="text-sand/70 leading-relaxed">
                Extracción limpia directa de botellas oficiales mediante jeringas de vidrio y atomizadores de bruma fina sin alterar la fórmula.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-sand/10 border border-champagne/30 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-champagne" />
            </div>
            <div>
              <h4 className="font-editorial text-base text-porcelain font-medium mb-1">Asesoría Olfativa Personalizada</h4>
              <p className="text-sand/70 leading-relaxed">
                Orientación directa sobre estela, duración según clima, pH y estilo para encontrar tu fragancia insignia.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info with Official Light Logo */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-light.png"
                alt="A&D Parfum"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-sand/75 leading-relaxed max-w-sm">
              Casa curadora de alta perfumería de Medio Oriente, elixires de nicho y decants exclusivos. Conectamos a los amantes del aroma con las composiciones olfativas más extraordinarias del mundo.
            </p>
            
            <div className="pt-2 flex items-center gap-3">
              <Link
                href="https://www.instagram.com/adparfum/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-sand/10 hover:bg-champagne/20 border border-sand/20 flex items-center justify-center text-porcelain hover:text-champagne transition-colors"
                aria-label="Instagram de A&D Parfum"
              >
                <Instagram className="w-4 h-4" />
              </Link>
              <Link
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-sand/10 hover:bg-champagne/20 border border-sand/20 flex items-center justify-center text-porcelain hover:text-champagne transition-colors"
                aria-label="WhatsApp A&D Parfum"
              >
                <MessageCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Catalog Navigation */}
          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-luxury text-champagne mb-4">
              Colecciones
            </h5>
            <ul className="space-y-2.5 text-xs text-sand/80">
              <li>
                <Link href="/perfumes" className="hover:text-champagne transition-colors">
                  Todos los Perfumes
                </Link>
              </li>
              <li>
                <Link href="/perfumes?category=cat-arabes" className="hover:text-champagne transition-colors">
                  Perfumes Árabes
                </Link>
              </li>
              <li>
                <Link href="/perfumes?category=cat-decants" className="hover:text-champagne transition-colors">
                  Decants & Muestras (5ml y 10ml)
                </Link>
              </li>
              <li>
                <Link href="/perfumes?category=cat-nicho" className="hover:text-champagne transition-colors">
                  Alta Gama & Nicho
                </Link>
              </li>
              <li>
                <Link href="/perfumes?category=cat-masculinos" className="hover:text-champagne transition-colors">
                  Masculinos & Bestias Negras
                </Link>
              </li>
              <li>
                <Link href="/perfumes?category=cat-femeninos" className="hover:text-champagne transition-colors">
                  Femeninos & Gourmands
                </Link>
              </li>
            </ul>
          </div>

          {/* Perfume Houses */}
          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-luxury text-champagne mb-4">
              Casas Olfativas
            </h5>
            <ul className="space-y-2.5 text-xs text-sand/80">
              <li>
                <Link href="/perfumes?brand=brand-lattafa" className="hover:text-champagne transition-colors">
                  Lattafa Perfumes
                </Link>
              </li>
              <li>
                <Link href="/perfumes?brand=brand-afnan" className="hover:text-champagne transition-colors">
                  Afnan Perfumes
                </Link>
              </li>
              <li>
                <Link href="/perfumes?brand=brand-armaf" className="hover:text-champagne transition-colors">
                  Armaf
                </Link>
              </li>
              <li>
                <Link href="/perfumes?brand=brand-rasasi" className="hover:text-champagne transition-colors">
                  Rasasi
                </Link>
              </li>
              <li>
                <Link href="/perfumes?brand=brand-al-haramain" className="hover:text-champagne transition-colors">
                  Al Haramain
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-luxury text-champagne mb-4">
              Servicio & Información
            </h5>
            <ul className="space-y-2.5 text-xs text-sand/80">
              <li>
                <Link href="/#envios" className="hover:text-champagne transition-colors">
                  Política de Despachos
                </Link>
              </li>
              <li>
                <Link href="/#autenticidad" className="hover:text-champagne transition-colors">
                  Garantía de Decants
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-champagne transition-colors flex items-center gap-1">
                  <span>Acceso Administrativo</span>
                  <ArrowUpRight className="w-3 h-3 text-taupe" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-sand/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-sand/60">
          <p>© {new Date().getFullYear()} A&D Parfum. Todos los derechos reservados. Diseño editorial de alta perfumería.</p>
          <div className="flex items-center gap-6">
            <span>Envíos asegurados a nivel nacional</span>
            <span>•</span>
            <span className="text-champagne">Pago Contra Entrega o Transferencia</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
