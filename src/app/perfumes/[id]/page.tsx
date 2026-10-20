import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductById, getProducts } from "@/lib/storage";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductById(params.id);
  if (!product) {
    return {
      title: "Perfume no encontrado | A&D Parfum",
    };
  }

  return {
    title: `${product.name} — ${product.brand_name} | A&D Parfum`,
    description: `${product.short_description} Disponible en decants de 5ml, 10ml y presentación completa en A&D Parfum Colombia.`,
    openGraph: {
      title: `${product.name} (${product.brand_name}) — A&D Parfum`,
      description: product.short_description,
      images: [{ url: product.primary_image }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter(
    (p) =>
      p.id !== product.id &&
      (p.category_id === product.category_id || p.brand_id === product.brand_id)
  );

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
