import React, { Suspense } from "react";
import { getBrands, getCategories, getProducts } from "@/lib/storage";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo de Perfumes & Decants | Fragance Stock RD",
  description:
    "Explora nuestra selecta curaduría de perfumes 100% originales, fragancias árabes, de nicho y decants en frascos de cristal.",
};

export default async function PerfumesPage() {
  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories(),
  ]);

  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-taupe font-editorial italic">Cargando colección Fragance Stock RD...</div>}>
      <CatalogClient
        initialProducts={products}
        brands={brands}
        categories={categories}
      />
    </Suspense>
  );
}
