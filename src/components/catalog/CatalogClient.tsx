"use client";

import React, { useState, useMemo, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  Droplet,
  ChevronDown,
  Eye,
  Sparkles,
} from "lucide-react";
import { Brand, Category, Product } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { EditorialProductCard } from "./EditorialProductCard";
import { RevealOnScroll } from "@/components/ui/motion/RevealOnScroll";

interface Props {
  initialProducts: Product[];
  brands: Brand[];
  categories: Category[];
}

export function CatalogClient({ initialProducts, brands, categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // URL state
  const queryParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "all";
  const brandParam = searchParams.get("brand") || "all";
  const familyParam = searchParams.get("family") || "all";
  const sortParam = searchParams.get("sort") || "featured";

  const [search, setSearch] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [selectedFamily, setSelectedFamily] = useState(familyParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Sync internal state when URL changes
  useEffect(() => {
    setSearch(queryParam);
    setSelectedCategory(categoryParam);
    setSelectedBrand(brandParam);
    setSelectedFamily(familyParam);
    setSelectedSort(sortParam);
  }, [queryParam, categoryParam, brandParam, familyParam, sortParam]);

  // Update URL helper
  const updateUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v && v !== "all") {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    });

    startTransition(() => {
      router.push(`/perfumes?${params.toString()}`);
    });
  };

  // Olfactory families derived from products
  const families = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => set.add(p.olfactory_family));
    return Array.from(set);
  }, [initialProducts]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        if (!p.is_active) return false;

        // Search
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand_name.toLowerCase().includes(q);
          const matchDesc = p.short_description.toLowerCase().includes(q);
          const matchNotes =
            p.top_notes.some((n) => n.toLowerCase().includes(q)) ||
            p.heart_notes.some((n) => n.toLowerCase().includes(q)) ||
            p.base_notes.some((n) => n.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchDesc && !matchNotes) return false;
        }

        // Category
        if (selectedCategory !== "all") {
          if (p.category_id !== selectedCategory && !p.category_name.toLowerCase().includes(selectedCategory.toLowerCase())) {
            return false;
          }
        }

        // Brand
        if (selectedBrand !== "all") {
          if (p.brand_id !== selectedBrand && !p.brand_name.toLowerCase().includes(selectedBrand.toLowerCase())) {
            return false;
          }
        }

        // Family
        if (selectedFamily !== "all") {
          if (p.olfactory_family !== selectedFamily) return false;
        }

        // Availability
        if (onlyAvailable) {
          const hasInStock = p.variants.some((v) => v.is_available && v.stock > 0);
          if (!hasInStock) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const minPriceA = Math.min(...a.variants.map((v) => v.price));
        const minPriceB = Math.min(...b.variants.map((v) => v.price));

        if (selectedSort === "price-asc") return minPriceA - minPriceB;
        if (selectedSort === "price-desc") return minPriceB - minPriceA;
        if (selectedSort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        // Featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    initialProducts,
    search,
    selectedCategory,
    selectedBrand,
    selectedFamily,
    onlyAvailable,
    selectedSort,
  ]);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedFamily("all");
    setOnlyAvailable(false);
    setSelectedSort("featured");
    router.push("/perfumes");
  };

  const hasActiveFilters =
    Boolean(search) ||
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    selectedFamily !== "all" ||
    onlyAvailable;

  return (
    <div className="py-12 bg-porcelain">
      <div className="max-w-cowboy mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="pb-8 border-b border-sand/70">
          <div className="flex items-center gap-2 text-xs text-taupe mb-3">
            <Link href="/" className="hover:text-espresso transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-espresso font-medium">Catálogo A&D Parfum</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-champagne font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curaduría Olfativa Completa</span>
              </div>
              <h1 className="heading-section text-espresso font-editorial">
                Colección de Fragancias & Decants
              </h1>
              <p className="text-xs sm:text-sm text-taupe mt-2 max-w-xl font-light leading-relaxed">
                Explora el catálogo oficial de A&D Parfum. Selecciona entre muestras fraccionadas (decants en atomizador de cristal) o presentaciones selladas en frascos originales.
              </p>
            </div>

            <div className="text-xs text-graphite font-medium">
              Mostrando <strong className="text-espresso font-bold">{filteredProducts.length}</strong> de{" "}
              {initialProducts.length} fragancias
            </div>
          </div>
        </div>

        {/* Quick Category Selector Pills */}
        <div className="pt-6 pb-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: "all", label: "Todas las fragancias" },
            { id: "cat-arabes", label: "Perfumes Árabes" },
            { id: "cat-decants", label: "Decants & Muestras" },
            { id: "cat-nicho", label: "Alta Gama & Nicho" },
            { id: "Hombre", label: "Masculinos" },
            { id: "Mujer", label: "Femeninos" },
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id);
                  updateUrl({ category: tab.id });
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-noir text-white shadow-sm"
                    : "bg-white text-gray hover:text-noir border border-border"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search, Filter bar & Sort controls */}
        <div className="py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-sand/70">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-taupe absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                updateUrl({ search: e.target.value });
              }}
              placeholder="Buscar por nombre, casa o notas..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-sand rounded-cowboy text-xs text-espresso placeholder-taupe focus:outline-none focus:border-espresso transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  updateUrl({ search: "" });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-espresso"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 lg:hidden"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-champagne" />
              <span>Filtros</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-champagne" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  updateUrl({ sort: e.target.value });
                }}
                className="appearance-none bg-white hover:bg-sand/20 text-espresso text-xs font-medium py-2.5 pl-4 pr-9 rounded-cowboy border border-sand focus:outline-none focus:border-espresso cursor-pointer shadow-sm"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="newest">Más Recientes</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-taupe absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filter Pills Strip */}
        {hasActiveFilters && (
          <div className="py-4 flex flex-wrap items-center gap-2 border-b border-sand/70 text-xs">
            <span className="text-taupe font-medium">Filtros aplicados:</span>

            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-espresso border border-sand">
                <span>Búsqueda: &quot;{search}&quot;</span>
                <button onClick={() => updateUrl({ search: "" })}>
                  <X className="w-3 h-3 text-taupe hover:text-espresso" />
                </button>
              </span>
            )}

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-espresso border border-sand">
                <span>Categoría: {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}</span>
                <button onClick={() => updateUrl({ category: "all" })}>
                  <X className="w-3 h-3 text-taupe hover:text-espresso" />
                </button>
              </span>
            )}

            {selectedBrand !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-espresso border border-sand">
                <span>Casa: {brands.find((b) => b.id === selectedBrand)?.name || selectedBrand}</span>
                <button onClick={() => updateUrl({ brand: "all" })}>
                  <X className="w-3 h-3 text-taupe hover:text-espresso" />
                </button>
              </span>
            )}

            {selectedFamily !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-espresso border border-sand">
                <span>Familia: {selectedFamily}</span>
                <button onClick={() => updateUrl({ family: "all" })}>
                  <X className="w-3 h-3 text-taupe hover:text-espresso" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs text-smoke hover:text-espresso underline ml-2 font-medium"
            >
              Limpiar todos
            </button>
          </div>
        )}

        {/* Layout: Sidebar Filter (Desktop) + Product Grid */}
        <div className="pt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-4">
            {/* Categories */}
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-luxury text-taupe mb-3">
                Categorías
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateUrl({ category: "all" })}
                  className={`w-full text-left text-xs py-2 px-3 rounded-md flex items-center justify-between transition-colors ${
                    selectedCategory === "all"
                      ? "bg-espresso text-champagne font-semibold shadow-sm"
                      : "text-graphite hover:bg-white"
                  }`}
                >
                  <span>Todas</span>
                  <span className="text-[10px]">{initialProducts.length}</span>
                </button>
                {categories.map((cat) => {
                  const count = initialProducts.filter((p) => p.category_id === cat.id).length;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => updateUrl({ category: cat.id })}
                      className={`w-full text-left text-xs py-2 px-3 rounded-md flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-espresso text-champagne font-semibold shadow-sm"
                          : "text-graphite hover:bg-white"
                      }`}
                    >
                      <span className="line-clamp-1">{cat.name}</span>
                      <span className="text-[10px]">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brands */}
            <div className="pt-6 border-t border-sand/70">
              <h3 className="text-[10px] font-semibold uppercase tracking-luxury text-taupe mb-3">
                Casas Olfativas
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateUrl({ brand: "all" })}
                  className={`w-full text-left text-xs py-2 px-3 rounded-md flex items-center justify-between transition-colors ${
                    selectedBrand === "all"
                      ? "bg-espresso text-champagne font-semibold shadow-sm"
                      : "text-graphite hover:bg-white"
                  }`}
                >
                  <span>Todas</span>
                  <span className="text-[10px]">{initialProducts.length}</span>
                </button>
                {brands.map((b) => {
                  const count = initialProducts.filter((p) => p.brand_id === b.id).length;
                  const isSelected = selectedBrand === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => updateUrl({ brand: b.id })}
                      className={`w-full text-left text-xs py-2 px-3 rounded-md flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-espresso text-champagne font-semibold shadow-sm"
                          : "text-graphite hover:bg-white"
                      }`}
                    >
                      <span>{b.name}</span>
                      <span className="text-[10px]">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Olfactory Families */}
            <div className="pt-6 border-t border-sand/70">
              <h3 className="text-[10px] font-semibold uppercase tracking-luxury text-taupe mb-3">
                Familia Olfativa
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateUrl({ family: "all" })}
                  className={`w-full text-left text-xs py-2 px-3 rounded-md flex items-center justify-between transition-colors ${
                    selectedFamily === "all"
                      ? "bg-espresso text-champagne font-semibold shadow-sm"
                      : "text-graphite hover:bg-white"
                  }`}
                >
                  <span>Todas las Familias</span>
                </button>
                {families.map((fam) => (
                  <button
                    key={fam}
                    onClick={() => updateUrl({ family: fam })}
                    className={`w-full text-left text-xs py-2 px-3 rounded-md flex items-center justify-between transition-colors ${
                      selectedFamily === fam
                        ? "bg-espresso text-champagne font-semibold shadow-sm"
                        : "text-graphite hover:bg-white"
                    }`}
                  >
                    <span className="line-clamp-1">{fam}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* In stock toggle */}
            <div className="pt-6 border-t border-sand/70">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-espresso">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded border-sand text-espresso focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>Solo unidades en stock</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-sand/20 rounded-cowboy border border-sand p-16 text-center">
                <Droplet className="w-10 h-10 text-champagne mx-auto mb-4" />
                <h3 className="font-editorial text-2xl font-normal text-espresso mb-2">
                  No se encontraron perfumes
                </h3>
                <p className="text-xs text-smoke max-w-sm mx-auto mb-6 font-light">
                  Intenta ajustar los filtros aplicados o busca por otro término (ejemplo: Lattafa, vainilla, Hawas, decant).
                </p>
                <button
                  onClick={clearAllFilters}
                  className="btn-gold text-xs"
                >
                  Ver Todo el Catálogo A&D
                </button>
              </div>
            ) : (
              <div>
                {/* Spotlight hero banner when default view or category view with products */}
                {!search && selectedBrand === "all" && selectedFamily === "all" && filteredProducts.length > 0 && (
                  <RevealOnScroll direction="fade" delayMs={40}>
                    <EditorialProductCard product={filteredProducts[0]} featuredSpotlight={true} />
                  </RevealOnScroll>
                )}

                {/* Asymmetric Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(!search && selectedBrand === "all" && selectedFamily === "all"
                    ? filteredProducts.slice(1)
                    : filteredProducts
                  ).map((product, idx) => (
                    <React.Fragment key={product.id}>
                      <RevealOnScroll direction="up" delayMs={idx * 50} className="h-full">
                        <EditorialProductCard product={product} />
                      </RevealOnScroll>

                      {/* Editorial interlude card after product 3 */}
                      {idx === 2 && (
                        <div className="sm:col-span-2 xl:col-span-3 my-3 p-8 sm:p-10 rounded-cowboy bg-espresso text-porcelain border border-champagne/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden grain-overlay">
                          <div className="space-y-2 max-w-lg">
                            <span className="text-[10px] uppercase tracking-luxury text-champagne font-semibold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              Pureza Olfativa Garantizada
                            </span>
                            <h4 className="font-editorial text-2xl text-porcelain font-normal">
                              La Ciencia del Decant en Cristal Neutro
                            </h4>
                            <p className="text-xs text-sand/75 font-light leading-relaxed">
                              Extraemos cada muestra bajo pedido con jeringas de vidrio y atomizadores de bruma ultra fina para mantener intacta la concentración y sillage original.
                            </p>
                          </div>
                          <Link
                            href="/perfumes?category=cat-decants"
                            className="btn-gold text-xs py-3 px-6 whitespace-nowrap shadow-lg"
                          >
                            Probar Muestras 5ml y 10ml
                          </Link>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-espresso/50 backdrop-blur-sm"
            onClick={() => setFilterDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-porcelain border-l border-sand p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sand">
                <h3 className="font-editorial text-xl font-normal text-espresso">Filtros A&D</h3>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1.5 text-graphite hover:text-espresso rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="py-4 border-b border-sand">
                <span className="text-xs uppercase font-semibold text-taupe block mb-2">Categoría</span>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      updateUrl({ category: "all" });
                      setFilterDrawerOpen(false);
                    }}
                    className={`w-full text-left text-xs py-1.5 px-2.5 rounded ${
                      selectedCategory === "all" ? "bg-espresso text-champagne font-semibold" : "text-graphite"
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        updateUrl({ category: c.id });
                        setFilterDrawerOpen(false);
                      }}
                      className={`w-full text-left text-xs py-1.5 px-2.5 rounded ${
                        selectedCategory === c.id ? "bg-espresso text-champagne font-semibold" : "text-graphite"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="py-4 border-b border-sand">
                <span className="text-xs uppercase font-semibold text-taupe block mb-2">Casas</span>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      updateUrl({ brand: "all" });
                      setFilterDrawerOpen(false);
                    }}
                    className={`w-full text-left text-xs py-1.5 px-2.5 rounded ${
                      selectedBrand === "all" ? "bg-espresso text-champagne font-semibold" : "text-graphite"
                    }`}
                  >
                    Todas
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        updateUrl({ brand: b.id });
                        setFilterDrawerOpen(false);
                      }}
                      className={`w-full text-left text-xs py-1.5 px-2.5 rounded ${
                        selectedBrand === b.id ? "bg-espresso text-champagne font-semibold" : "text-graphite"
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="btn-gold w-full text-xs"
              >
                Ver {filteredProducts.length} Resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
