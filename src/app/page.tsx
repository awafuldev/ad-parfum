import React from "react";
import { getProducts, getCategories, getBrands } from "@/lib/storage";
import { Hero } from "@/components/home/Hero";
import { HomeInventory } from "@/components/home/HomeInventory";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="flex flex-col bg-ivory">
      {/* 1. Large Luxury Campaign Hero */}
      <Hero />

      {/* 2. Direct Perfume Inventory Immediately Below */}
      <HomeInventory products={products} categories={categories} brands={brands} />
    </div>
  );
}
