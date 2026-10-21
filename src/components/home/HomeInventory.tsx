"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Check, Eye, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Product, ProductVariant, Category, Brand } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { useCart } from "@/context/CartContext";

interface Props {
  products: Product[];
  categories?: Category[];
  brands?: Brand[];
}

export function HomeInventory({ products, categories = [] }: Props) {
  const { addItem, openCart } = useCart();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [cardSelectedVariants, setCardSelectedVariants] = useState<Record<string, ProductVariant>>({});
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.is_active) return false;

        // Search query
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
          if (
            p.category_id !== selectedCategory &&
            !p.category_name.toLowerCase().includes(selectedCategory.toLowerCase()) &&
            !p.category_id.toLowerCase().includes(selectedCategory.toLowerCase())
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
  }, [products, search, selectedCategory, onlyAvailable, selectedSort]);

  // Handle format switch on card
  const handleSelectVariant = (productId: string, variant: ProductVariant) => {
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
    }, 500);
  };

  const categoryPills = [
    { id: "all", label: "Todas las fragancias" },
    { id: "cat-arabes", label: "Perfumes Árabes" },
    { id: "cat-decants", label: "Decants (5ml y 10ml)" },
    { id: "cat-nicho", label: "Alta Gama & Nicho" },
    { id: "cat-masculinos", label: "Masculinos" },
    { id: "cat-femeninos", label: "Femeninos" },
  ];

  return (
    <section id="inventario" className="w-full bg-ivory py-16 sm:py-24 border-t border-border">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 sm:pb-12 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-wine inline-block" />
              <span className="text-[11px] font-semibold uppercase tracking-luxury text-gray">
                Inventario Oficial Disponible
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-noir tracking-tight">
              Explora las fragancias
            </h2>
          </div>

          <div className="space-y-2 text-right md:text-right">
            <p className="text-xs sm:text-sm text-gray font-light max-w-md">
              Muestras fraccionadas en atomizadores de cristal y presentaciones completas selladas de fábrica con garantía de origen.
            </p>
            <div className="flex items-center md:justify-end gap-2 text-[11px] text-noir font-medium">
              <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-border shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>+100 Clientes en RD</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-border shadow-2xs">
                <span>🚚 Envíos a todo el país</span>
              </span>
            </div>
          </div>
        </div>

        {/* Discrete Filters & Search Toolbar */}
        <div className="pt-6 pb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {categoryPills.map((pill) => {
                const isActive = selectedCategory === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedCategory(pill.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-noir text-white shadow-sm"
                        : "bg-white text-gray hover:text-noir border border-border hover:border-noir/40"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Right: Search, Availability & Sort */}
            <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
              
              {/* Search input */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-gray absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar perfume..."
                  className="w-full pl-8 pr-7 py-2 bg-white border border-border rounded-full text-xs text-noir placeholder-gray focus:outline-none focus:border-noir transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray hover:text-noir p-0.5"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="appearance-none bg-white border border-border rounded-full px-3.5 py-2 pr-8 text-xs text-noir font-medium focus:outline-none focus:border-noir cursor-pointer transition-colors"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name-asc">Nombre A-Z</option>
                </select>
                <ArrowUpDown className="w-3 h-3 text-gray absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Only Available Toggle */}
              <label className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-3.5 py-2 text-xs text-noir font-medium cursor-pointer hover:border-noir/40 transition-colors">
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

          {/* Active Filter Notice */}
          <div className="flex items-center justify-between text-xs text-gray pt-1">
            <span>
              Mostrando <strong className="text-noir font-semibold">{filteredProducts.length}</strong> de{" "}
              {products.length} fragancias disponibles
            </span>
            {(search || selectedCategory !== "all" || onlyAvailable) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setOnlyAvailable(false);
                }}
                className="text-wine hover:underline font-medium text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Limpiar filtros</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-cowboy border border-border space-y-4">
            <h3 className="font-editorial text-2xl font-normal text-noir">
              No se encontraron fragancias
            </h3>
            <p className="text-xs text-gray max-w-sm mx-auto">
              No hay perfumes que coincidan con los criterios seleccionados. Prueba con otro término o limpia los filtros.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setOnlyAvailable(false);
              }}
              className="btn-primary text-xs"
            >
              Ver todas las fragancias
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
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
                  className="group bg-white rounded-cowboy border border-border hover:border-noir/30 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-lg"
                >
                  {/* Image Stage */}
                  <div className="relative aspect-[4/5] bg-ivory overflow-hidden">
                    <Link href={`/perfumes/${product.id}`} className="block w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.primary_image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    {/* Concentration & Brand Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                      <span className="bg-noir/80 backdrop-blur-md text-white text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full">
                        {product.concentration}
                      </span>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 right-3 z-10 pointer-events-none">
                      {isAvailable ? (
                        <span className="bg-white/95 backdrop-blur-md text-emerald-800 text-[10px] font-medium px-2 py-0.5 rounded-full border border-emerald-200">
                          En Stock
                        </span>
                      ) : (
                        <span className="bg-noir/80 text-white/70 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          Agotado
                        </span>
                      )}
                    </div>

                    {/* Quick View Overlay on Hover */}
                    <Link
                      href={`/perfumes/${product.id}`}
                      className="absolute inset-0 bg-noir/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    >
                      <span className="bg-white text-noir text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver detalle</span>
                      </span>
                    </Link>
                  </div>

                  {/* Card Information */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-gray uppercase tracking-luxury">
                        <span>{product.brand_name}</span>
                        <span className="text-[10px] text-gray/80">{product.gender}</span>
                      </div>

                      <Link href={`/perfumes/${product.id}`}>
                        <h3 className="font-editorial text-xl sm:text-2xl font-normal text-noir hover:text-wine transition-colors line-clamp-1 leading-snug">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-gray line-clamp-1 font-light">
                        {product.olfactory_family}
                      </p>
                    </div>

                    {/* Variant / Size Selector Pills */}
                    <div className="space-y-3 pt-2 border-t border-border/60">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {product.variants.map((v) => {
                          const isSelected = activeVariant?.id === v.id;
                          return (
                            <button
                              key={v.id}
                              onClick={() => handleSelectVariant(product.id, v)}
                              className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all duration-150 cursor-pointer ${
                                isSelected
                                  ? "bg-noir text-white shadow-xs"
                                  : "bg-ivory text-gray hover:text-noir border border-border"
                              }`}
                              title={`${v.name} - ${formatPrice(v.price)}`}
                            >
                              {v.size_ml} ml
                            </button>
                          );
                        })}
                      </div>

                      {/* Price & Action Row */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="block text-[10px] text-gray uppercase tracking-wider">
                            {activeVariant?.name || "Presentación"}
                          </span>
                          <span className="font-editorial text-2xl font-semibold text-noir">
                            {formatPrice(activeVariant?.price || product.base_price)}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          disabled={!isAvailable}
                          className={`p-2.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                            isAdded
                              ? "bg-wine text-white scale-110 shadow-md"
                              : isAvailable
                              ? "bg-noir text-white hover:bg-wine shadow-sm"
                              : "bg-gray/20 text-gray cursor-not-allowed"
                          }`}
                          aria-label={`Añadir ${product.name} a la bolsa`}
                          title={isAvailable ? "Añadir a la bolsa" : "Agotado temporalmente"}
                        >
                          {isAdded ? (
                            <Check className="w-4 h-4 animate-in zoom-in" />
                          ) : (
                            <ShoppingBag className="w-4 h-4" />
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
    </section>
  );
}
