import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_BY_SLUG_QUERY } from "@/lib/sanity/queries/products";
import { ProductGallery } from "@/components/app/ProductGallery";
import { ProductInfo } from "@/components/app/ProductInfo";
import { ProductJsonLd } from "@/components/seo/JsonLd";
import { formatPrice } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const imageUrl = product.images?.[0]?.asset?.url;
  const price = product.price ? formatPrice(product.price) : "";

  return {
    title: product.name,
    description: product.description || `${product.name} - ${price}. ${product.year} ${product.fuelType} ${product.transmission}. Available at RideRight Autos Kenya.`,
    openGraph: {
      title: `${product.name} | RideRight`,
      description: product.description || `${product.name} for sale at RideRight Autos Kenya. ${price}`,
      type: "website",
      url: `https://www.rideright.ke/products/${slug}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: product.name || "Vehicle image",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | RideRight`,
      description: product.description || `${product.name} for sale - ${price}`,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* SEO Structured Data */}
      <ProductJsonLd product={product} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}
