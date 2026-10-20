import { MetadataRoute } from "next";
import { getProducts } from "@/lib/storage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://adparfum.com";
  const products = await getProducts();

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/perfumes/${product.id}`,
    lastModified: new Date(product.updated_at || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/perfumes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...productRoutes,
  ];
}
