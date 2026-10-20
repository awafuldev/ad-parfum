import React, { Suspense } from "react";
import { getBrands, getCategories, getProducts } from "@/lib/storage";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo de Perfumes & Decants | A&D Parfum",
  description:
    "Explora nuestra selecta curaduría de perfumes árabes, fragancias de nicho y decants de 5ml y 10ml en frascos de cristal. Filtrado por notas, familias olfativas y casas oficiales.",
};

export default async function PerfumesPage() {
  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories(),
  ]);

  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-taupe font-editorial italic">Cargando colección A&D Parfum...</div>}>
      <CatalogClient
        initialProducts={products}
        brands={brands}
        categories={categories}
      />
    </Suspense>
  );
}
