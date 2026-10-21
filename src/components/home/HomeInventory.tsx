"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Check,
  Eye,
  X,
  ArrowUpDown,
  Sparkles,
  Droplet,
  Clock,
  Wind,
  Layers,
  ChevronRight,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { Product, ProductVariant, Category, Brand } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { useCart } from "@/context/CartContext";

interface Props {
  products: Product[];
  categories?: Category[];
  brands?: Brand[];
}

export function HomeInventory({ products, categories = [], brands = [] }: Props) {
  const { addItem, openCart } = useCart();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [cardSelectedVariants, setCardSelectedVariants] = useState<Record<string, ProductVariant>>({});
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Listen to custom search event from Navbar
  useEffect(() => {
    const handleSearchEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSearch(customEvent.detail);
      }
    };
    window.addEventListener("adparfum:search", handleSearchEvent);
    return () => window.removeEventListener("adparfum:search", handleSearchEvent);
  }, []);

  // Distinct brand list from products
  const availableBrands = useMemo(() => {
    const unique = new Map<string, string>();
    products.forEach((p) => {
      if (p.brand_name) unique.set(p.brand_id || p.brand_name, p.brand_name);
    });
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.is_active) return false;

        // Search query (matches name, brand, family, notes)
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand_name.toLowerCase().includes(q);
          const matchFamily = p.olfactory_family.toLowerCase().includes(q);
          const matchNotes =
            p.top_notes.some((n) => n.toLowerCase().includes(q)) ||
            p.heart_notes.some((n) => n.toLowerCase().includes(q)) ||
            p.base_notes.some((n) => n.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchFamily && !matchNotes) return false;
        }

        // Category filter
        if (selectedCategory !== "all") {
          const cat = selectedCategory.toLowerCase();
          if (cat === "cat-arabes") {
            if (!p.category_id.includes("arabes") && !p.category_name.toLowerCase().includes("árabe")) {
              return false;
            }
          } else if (cat === "cat-decants") {
            if (!p.variants.some((v) => v.size_ml <= 10)) {
              return false;
            }
          } else if (cat === "cat-nicho") {
            if (!p.category_id.includes("nicho") && !p.category_name.toLowerCase().includes("nicho")) {
              return false;
            }
          } else if (cat === "cat-masculinos") {
            if (p.gender !== "Hombre" && p.gender !== "Unisex") return false;
          } else if (cat === "cat-femeninos") {
            if (p.gender !== "Mujer" && p.gender !== "Unisex") return false;
          } else if (
            p.category_id !== selectedCategory &&
            !p.category_name.toLowerCase().includes(cat)
          ) {
            return false;
          }
        }

        // Brand filter
        if (selectedBrand !== "all") {
          if (
            p.brand_id !== selectedBrand &&
            p.brand_name.toLowerCase() !== selectedBrand.toLowerCase()
          ) {
            return false;
          }
        }

        // Availability filter
        if (onlyAvailable) {
          const hasStock = p.variants.some((v) => v.is_available && v.stock > 0);
          if (!hasStock) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "price-asc") {
          return a.base_price - b.base_price;
        }
        if (selectedSort === "price-desc") {
          return b.base_price - a.base_price;
        }
        if (selectedSort === "name-asc") {
          return a.name.localeCompare(b.name);
        }
        // Default featured / bestseller
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, search, selectedCategory, selectedBrand, onlyAvailable, selectedSort]);

  // Handle format switch on card
  const handleSelectVariant = (productId: string, variant: ProductVariant, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCardSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));
  };

  // Handle quick add to cart
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const activeVariant =
      cardSelectedVariants[product.id] ||
      product.variants.find((v) => v.is_available && v.stock > 0) ||
      product.variants[0];

    if (!activeVariant || !activeVariant.is_available) return;

    addItem(product, activeVariant, 1);
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));

    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
      openCart();
    }, 450);
  };

  const categoryPills = [
    { id: "all", label: "Todas las fragancias" },
    { id: "cat-arabes", label: "Perfumes Árabes" },
    { id: "cat-decants", label: "Decants (5ml y 10ml)" },
    { id: "cat-nicho", label: "Alta Gama & Nicho" },
    { id: "cat-masculinos", label: "Hombre & Unisex" },
    { id: "cat-femeninos", label: "Mujer & Unisex" },
  ];

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setOnlyAvailable(false);
    setSelectedSort("featured");
  };

  const hasActiveFilters = search || selectedCategory !== "all" || selectedBrand !== "all" || onlyAvailable;

  return (
    <section id="inventario" className="w-full bg-ivory py-16 sm:py-20 border-t border-border">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intuitive Section Header with Business Credentials */}
        <div className="pb-8 border-b border-border space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-luxury text-gray">
                <span className="w-1.5 h-1.5 rounded-full bg-wine" />
                <span>02 — Colección &amp; Inventario Real</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-noir tracking-tight">
                Explora las fragancias
              </h2>
              <p className="text-xs sm:text-sm text-gray font-light max-w-lg">
                Decants auténticos en atomizador de cristal y frascos sellados. Perfumería árabe legendaria y elixires de nicho listos para entrega inmediata.
              </p>
            </div>

            {/* Business Trust Metrics Pill */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-noir font-medium">
              <span className="inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-border shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-noir">+100 Clientes en RD</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-full border border-border text-gray shadow-2xs">
                <span>🚚 Envíos a todo el país</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-full border border-border text-gray shadow-2xs">
                <span>✨ 100% Genuinos</span>
              </span>
            </div>
          </div>
        </div>

        {/* Intuitive Filter & Control Center */}
        <div className="py-6 space-y-4 border-b border-border/80">
          
          {/* Level 1: Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryPills.map((pill) => {
              const isActive = selectedCategory === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setSelectedCategory(pill.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-noir text-white shadow-sm"
                      : "bg-white text-gray hover:text-noir border border-border hover:border-noir/30"
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* Level 2: Search, Brand Filter, Sort & Stock Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2">
            
            {/* Live Search Input */}
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 text-gray absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por perfume, casa (Lattafa, Afnan) o notas..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-border rounded-full text-xs text-noir placeholder-gray focus:outline-none focus:border-noir focus:ring-1 focus:ring-noir transition-all shadow-2xs"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-noir p-1"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Brand Dropdown / Quick Select */}
            <div className="lg:col-span-3 relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full appearance-none bg-white border border-border rounded-full px-4 py-2.5 pr-8 text-xs text-noir font-medium focus:outline-none focus:border-noir cursor-pointer transition-colors shadow-2xs"
              >
                <option value="all">Todas las marcas / casas</option>
                {availableBrands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-gray absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Selector */}
            <div className="lg:col-span-2 relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full appearance-none bg-white border border-border rounded-full px-4 py-2.5 pr-8 text-xs text-noir font-medium focus:outline-none focus:border-noir cursor-pointer transition-colors shadow-2xs"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="name-asc">Nombre A-Z</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-gray absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Only In-Stock Filter */}
            <div className="lg:col-span-2 flex items-center">
              <label className="w-full inline-flex items-center justify-center gap-2 bg-white border border-border rounded-full px-4 py-2.5 text-xs text-noir font-medium cursor-pointer hover:border-noir/40 transition-colors shadow-2xs">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded text-wine focus:ring-0 cursor-pointer w-3.5 h-3.5"
                />
                <span className="whitespace-nowrap">Solo en stock</span>
              </label>
            </div>

          </div>

          {/* Active Filter Badges Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span>
                Mostrando <strong className="text-noir font-bold">{filteredProducts.length}</strong> de{" "}
                {products.length} fragancias
              </span>

              {hasActiveFilters && (
                <>
                  <span className="text-border">•</span>
                  {search && (
                    <span className="inline-flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-border text-[11px] text-noir">
                      <span>&quot;{search}&quot;</span>
                      <button onClick={() => setSearch("")} className="hover:text-wine">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-border text-[11px] text-noir">
                      <span>Categoría seleccionada</span>
                      <button onClick={() => setSelectedCategory("all")} className="hover:text-wine">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedBrand !== "all" && (
                    <span className="inline-flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-border text-[11px] text-noir">
                      <span>{selectedBrand}</span>
                      <button onClick={() => setSelectedBrand("all")} className="hover:text-wine">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-wine hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Limpiar todos los filtros</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-cowboy border border-border space-y-4 my-8">
            <h3 className="font-editorial text-2xl font-normal text-noir">
              No se encontraron fragancias
            </h3>
            <p className="text-xs text-gray max-w-sm mx-auto">
              No encontramos perfumes que coincidan con los filtros seleccionados. Prueba con otro término o limpia los filtros.
            </p>
            <button onClick={clearAllFilters} className="btn-primary text-xs">
              Ver todas las fragancias
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 pt-8">
            {filteredProducts.map((product) => {
              const activeVariant =
                cardSelectedVariants[product.id] ||
                product.variants.find((v) => v.is_available && v.stock > 0) ||
                product.variants[0];

              const isAdded = addedItemMap[product.id];
              const isAvailable = activeVariant?.is_available && activeVariant?.stock > 0;

              return (
                <article
                  key={product.id}
                  className="group bg-white rounded-2xl border border-border/90 hover:border-noir transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-xl"
                >
                  {/* Architectural Luxury Pedestal Stage */}
                  <div className="relative aspect-[4/5] bg-gradient-to-b from-[#FBFBF9] via-[#FAF9F5] to-[#F2EFE9] border-b border-border/70 flex items-center justify-center p-6 sm:p-7 overflow-hidden">
                    <Link href={`/perfumes/${product.id}`} className="w-full h-full flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.primary_image}
                        alt={`${product.name} — ${product.brand_name}`}
                        className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.09)] transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    {/* Concentration & Highlights Badges */}
                    <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
                      <span className="bg-noir/90 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        {product.concentration}
                      </span>
                      {product.is_bestseller && (
                        <span className="bg-wine text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 w-fit">
                          <Flame className="w-3 h-3" />
                          <span>Bestseller</span>
                        </span>
                      )}
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
                      {isAvailable ? (
                        <span className="bg-white/95 backdrop-blur-md text-emerald-800 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                          En Stock
                        </span>
                      ) : (
                        <span className="bg-noir/80 text-white/70 text-[10px] font-medium px-2.5 py-1 rounded-full">
                          Agotado
                        </span>
                      )}
                    </div>

                    {/* Quick View Button on Hover */}
                    <div className="absolute inset-x-3.5 bottom-3.5 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQuickViewProduct(product);
                        }}
                        className="flex-1 bg-white/95 backdrop-blur-md text-noir hover:bg-noir hover:text-white text-xs font-semibold py-2.5 px-3 rounded-full shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Vista Rápida</span>
                      </button>

                      <Link
                        href={`/perfumes/${product.id}`}
                        className="bg-white/95 backdrop-blur-md text-noir hover:bg-wine hover:text-white p-2.5 rounded-full shadow-lg flex items-center justify-center transition-all"
                        title="Ver ficha completa"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Card Content & Interactive Format Selector */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    
                    {/* Header Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-gray uppercase tracking-luxury font-bold">
                        <span>{product.brand_name}</span>
                        <span className="text-[10px] bg-ivory px-2 py-0.5 rounded-full border border-border text-noir/70 font-semibold">
                          {product.gender}
                        </span>
                      </div>

                      <Link href={`/perfumes/${product.id}`}>
                        <h3 className="font-editorial text-2xl font-normal text-noir group-hover:text-wine transition-colors line-clamp-1 leading-snug pt-0.5">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Olfactory Notes Preview */}
                      <p className="text-[11.5px] text-gray line-clamp-1 font-light flex items-center gap-1.5 pt-0.5">
                        <Droplet className="w-3 h-3 text-wine flex-shrink-0" />
                        <span>
                          {product.top_notes.slice(0, 2).join(", ")} • {product.base_notes[0] || product.olfactory_family}
                        </span>
                      </p>
                    </div>

                    {/* Intuitive Size / Presentation Segmented Control with Immediate Price Visibility */}
                    <div className="space-y-2.5 pt-3 border-t border-border/80">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-luxury text-gray">
                        <span>Presentación:</span>
                        <span className="text-noir font-semibold">{activeVariant?.size_ml} ml</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 bg-ivory p-1 rounded-xl border border-border">
                        {product.variants.map((v) => {
                          const isSelected = activeVariant?.id === v.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={(e) => handleSelectVariant(product.id, v, e)}
                              disabled={!v.is_available}
                              className={`py-2 px-1 rounded-lg text-center transition-all duration-150 cursor-pointer ${
                                !v.is_available
                                  ? "opacity-35 cursor-not-allowed text-gray"
                                  : isSelected
                                  ? "bg-noir text-white shadow-xs font-bold"
                                  : "bg-white text-noir hover:bg-border/40 font-medium"
                              }`}
                              title={`${v.name} — ${formatPrice(v.price)}`}
                            >
                              <span className="block text-[11px] leading-tight">
                                {v.size_ml} ml
                              </span>
                              <span className={`block text-[9.5px] ${isSelected ? "text-white/80" : "text-gray"}`}>
                                {formatPrice(v.price)}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Action Bar with Prominent Buy Button */}
                      <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                        <div className="flex-shrink-0 flex items-center">
                          <span className="font-price text-xl sm:text-2xl font-bold text-noir tracking-tight leading-none">
                            {formatPrice(activeVariant?.price || product.base_price)}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          disabled={!isAvailable}
                          className={`flex-1 h-11 px-4 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : isAvailable
                              ? "bg-noir text-white hover:bg-wine active:scale-98"
                              : "bg-gray/20 text-gray cursor-not-allowed"
                          }`}
                          aria-label={`Añadir ${product.name} a la bolsa`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4 animate-in zoom-in" />
                              <span>¡Añadido!</span>
                            </>
                          ) : isAvailable ? (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Añadir</span>
                            </>
                          ) : (
                            <span>Agotado</span>
                          )}
                        </button>
                      </div>

                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* Intuitive Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-noir/75 backdrop-blur-sm transition-opacity"
            onClick={() => setQuickViewProduct(null)}
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white w-full max-w-3xl rounded-cowboy border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-noir hover:text-white rounded-full transition-colors border border-border shadow-md"
                aria-label="Cerrar vista rápida"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Product Image */}
                <div className="md:col-span-5 bg-ivory relative aspect-square md:aspect-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={quickViewProduct.primary_image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-noir text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {quickViewProduct.concentration}
                    </span>
                  </div>
                </div>

                {/* Details & Fast Add */}
                <div className="md:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray uppercase tracking-luxury font-medium">
                      <span>{quickViewProduct.brand_name}</span>
                      <span>{quickViewProduct.gender}</span>
                    </div>

                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-noir leading-tight">
                      {quickViewProduct.name}
                    </h3>

                    <p className="text-xs text-gray leading-relaxed font-light">
                      {quickViewProduct.short_description || quickViewProduct.description}
                    </p>

                    {/* Olfactory Notes */}
                    <div className="bg-ivory p-3.5 rounded-lg border border-border space-y-1.5 text-xs">
                      <p className="font-semibold text-noir flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-wine" />
                        <span>Notas Principales:</span>
                      </p>
                      <p className="text-gray text-[11px] leading-relaxed">
                        <strong>Salida:</strong> {quickViewProduct.top_notes.join(", ")}<br />
                        <strong>Corazón:</strong> {quickViewProduct.heart_notes.join(", ")}<br />
                        <strong>Fondo:</strong> {quickViewProduct.base_notes.join(", ")}
                      </p>
                    </div>

                    {/* Longevity & Sillage Badges */}
                    <div className="flex items-center gap-3 text-xs text-gray pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-wine" />
                        <span>{quickViewProduct.longevity}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5 text-wine" />
                        <span>{quickViewProduct.sillage}</span>
                      </span>
                    </div>
                  </div>

                  {/* Size Selector & Add to Cart */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray uppercase tracking-wider">
                        Selecciona el tamaño:
                      </span>
                      <span className="font-price text-2xl font-bold text-noir tracking-tight">
                        {formatPrice(
                          (cardSelectedVariants[quickViewProduct.id] || quickViewProduct.variants[0])?.price
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {quickViewProduct.variants.map((v) => {
                        const currentActive = cardSelectedVariants[quickViewProduct.id] || quickViewProduct.variants[0];
                        const isSelected = currentActive?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            onClick={(e) => handleSelectVariant(quickViewProduct.id, v, e)}
                            className={`py-2 px-2 rounded-lg text-center border transition-all ${
                              isSelected
                                ? "bg-noir text-white border-noir font-bold shadow-sm"
                                : "bg-white text-noir border-border hover:bg-ivory"
                            }`}
                          >
                            <span className="block text-xs font-semibold">{v.size_ml} ml</span>
                            <span className="block text-[10px] opacity-80">{formatPrice(v.price)}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        onClick={(e) => {
                          handleQuickAdd(quickViewProduct, e);
                          setQuickViewProduct(null);
                        }}
                        className="btn-wine flex-1 text-xs py-3.5 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Añadir a la Bolsa</span>
                      </button>

                      <Link
                        href={`/perfumes/${quickViewProduct.id}`}
                        onClick={() => setQuickViewProduct(null)}
                        className="btn-secondary text-xs py-3.5 px-4"
                      >
                        Ver Completo
                      </Link>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
