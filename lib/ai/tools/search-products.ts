import { tool } from "ai";
import { z } from "zod";
import { sanityFetch } from "@/sanity/lib/live";
import { AI_SEARCH_PRODUCTS_QUERY } from "@/lib/sanity/queries/products";
import { formatPrice } from "@/lib/utils";
import { getStockStatus, getStockMessage } from "@/lib/constants/stock";
import { FUEL_TYPE_VALUES, TRANSMISSION_VALUES, ORIGIN_TYPE_VALUES } from "@/lib/constants/filters";
import type { AI_SEARCH_PRODUCTS_QUERYResult } from "@/sanity.types";
import type { SearchProduct } from "@/lib/ai/types";

const productSearchSchema = z.object({
  query: z
    .string()
    .optional()
    .default("")
    .describe(
      "Search term to find cars by name, make, or description (e.g., 'Toyota', 'Land Cruiser', 'SUV')"
    ),
  category: z
    .string()
    .optional()
    .default("")
    .describe(
      "Filter by body type slug (e.g., 'suv', 'sedan', 'hatchback', 'coupe', 'pickup')"
    ),
  fuelType: z
    .enum(["", ...FUEL_TYPE_VALUES])
    .optional()
    .default("")
    .describe("Filter by fuel type"),
  transmission: z
    .enum(["", ...TRANSMISSION_VALUES])
    .optional()
    .default("")
    .describe("Filter by transmission type"),
  origin: z
    .enum(["", ...ORIGIN_TYPE_VALUES])
    .optional()
    .default("")
    .describe("Filter by origin (e.g., 'locally_used', 'foreign_used', 'brand_new')"),
  minPrice: z
    .number()
    .optional()
    .default(0)
    .describe("Minimum price in KES (e.g., 1000000)"),
  maxPrice: z
    .number()
    .optional()
    .default(0)
    .describe("Maximum price in KES (e.g., 10000000). Use 0 for no maximum."),
});

export const searchProductsTool = tool({
  description:
    "Search for cars in the dealership. Can search by name, make, or description, and filter by body type, fuel type, transmission, and price range. Returns car details including availability.",
  inputSchema: productSearchSchema,
  execute: async ({ query, category, fuelType, transmission, origin, minPrice, maxPrice }) => {
    console.log("[SearchProducts] Query received:", {
      query,
      category,
      fuelType,
      transmission,
      origin,
      minPrice,
      maxPrice,
    });

    try {
      const { data: products } = await sanityFetch({
        query: AI_SEARCH_PRODUCTS_QUERY,
        params: {
          searchQuery: (query || "").replace(/\bseater\b/gi, "seat"),
          categorySlug: category || "",
          fuelType: fuelType || "",
          transmission: transmission || "",
          origin: origin || "",
          minPrice: minPrice || 0,
          maxPrice: maxPrice || 0,
        },
      });

      console.log("[SearchProducts] Cars found:", products.length);

      if (products.length === 0) {
        return {
          found: false,
          message:
            "No cars found matching your criteria. Try different search terms or filters.",
          products: [],
          filters: {
            query,
            category,
            fuelType,
            transmission,
            origin,
            minPrice,
            maxPrice,
          },
        };
      }

      // Format the results with stock status for the AI to communicate
      const formattedProducts: SearchProduct[] = (
        products as AI_SEARCH_PRODUCTS_QUERYResult
      ).map((product) => ({
        id: product._id,
        name: product.name ?? null,
        slug: product.slug ?? null,
        description: product.description ?? null,
        price: product.price ?? null,
        priceFormatted: product.price ? formatPrice(product.price) : null,
        category: product.category?.title ?? null,
        categorySlug: product.category?.slug ?? null,
        make: product.category?.title ?? null,
        year: product.year ?? null,
        fuelType: product.fuelType ?? null,
        engine: product.engine ?? null,
        transmission: product.transmission ?? null,
        location: product.location ?? null,
        mileage: product.mileage ?? null,
        horsePower: product.horsePower ?? null,
        torque: product.torque ?? null,
        stockCount: product.stock ?? 0,
        stockStatus: getStockStatus(product.stock),
        stockMessage: getStockMessage(product.stock),
        featured: product.featured ?? false,
        imageUrl: product.image?.asset?.url ?? null,
        productUrl: product.slug ? `/products/${product.slug}` : null,
      }));

      return {
        found: true,
        message: `Found ${products.length} car${products.length === 1 ? "" : "s"} matching your search.`,
        totalResults: products.length,
        products: formattedProducts,
        filters: {
          query,
          category,
          fuelType,
          transmission,
          minPrice,
          maxPrice,
        },
      };
    } catch (error) {
      console.error("[SearchProducts] Error:", error);
      return {
        found: false,
        message: "An error occurred while searching for cars.",
        products: [],
        error: error instanceof Error ? error.message : "Unknown error",
        filters: {
          query,
          category,
          fuelType,
          transmission,
          minPrice,
          maxPrice,
        },
      };
    }
  },
});
