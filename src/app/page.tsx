import React from "react";
import { getProducts } from "@/lib/storage";
import { Hero } from "@/components/home/Hero";
import { FeaturedEditorial } from "@/components/home/FeaturedEditorial";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BestsellersShowcase } from "@/components/home/BestsellersShowcase";
import { OlfactoryExplorer } from "@/components/home/OlfactoryExplorer";
import { BrandStrip } from "@/components/home/BrandStrip";
import { BrandStory } from "@/components/home/BrandStory";
import { InstagramSection } from "@/components/home/InstagramSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedEditorial />
      <CategoryGrid />
      <BestsellersShowcase products={products} />
      <OlfactoryExplorer products={products} />
      <BrandStrip />
      <BrandStory />
      <InstagramSection />
    </div>
  );
}
