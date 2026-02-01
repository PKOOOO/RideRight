import { MetadataRoute } from "next";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const siteUrl = "https://rideright.ke";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all products for dynamic routes
  const products = await client.fetch<{ slug: string; _updatedAt: string }[]>(`
    *[_type == "product" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }
  `);

  // Fetch all categories
  const categories = await client.fetch<{ slug: string }[]>(`
    *[_type == "category" && defined(slug.current)] {
      "slug": slug.current
    }
  `);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // Product pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Category filter pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
