import React from "react";
import { getProducts } from "@/lib/storage";
import { Hero } from "@/components/home/Hero";
import { BestsellersShowcase } from "@/components/home/BestsellersShowcase";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { OlfactoryExplorer } from "@/components/home/OlfactoryExplorer";
import { BrandStrip } from "@/components/home/BrandStrip";
import { InstagramSection } from "@/components/home/InstagramSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col">
      <Hero />
      <BestsellersShowcase products={products} />
      <CategoryGrid />
      <OlfactoryExplorer products={products} />
      <BrandStrip />
      <InstagramSection />
    </div>
  );
}
