import Link from "next/link";
import { AddToCartButton } from "@/components/app/AddToCartButton";
import { AskAISimilarButton } from "@/components/app/AskAISimilarButton";
import { StockBadge } from "@/components/app/StockBadge";
import { formatPrice } from "@/lib/utils";
import type { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";

interface ProductInfoProps {
  product: NonNullable<PRODUCT_BY_SLUG_QUERYResult>;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const imageUrl = product.images?.[0]?.asset?.url;

  return (
    <div className="flex flex-col">
      {/* Category (Body Type) */}
      {product.category && (
        <Link
          href={`/?category=${product.category.slug}`}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {product.category.title}
        </Link>
      )}

      {/* Title */}
      <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {product.name}
      </h1>

      {/* Price */}
      <p className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        {formatPrice(product.price)}
      </p>

      {/* Description */}
      {product.description && (
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>
      )}

      {/* Stock & Add to Cart */}
      <div className="mt-6 flex flex-col gap-3">
        <StockBadge productId={product._id} stock={product.stock ?? 0} />
        <AddToCartButton
          productId={product._id}
          name={product.name ?? "Unknown Car"}
          price={product.price ?? 0}
          image={imageUrl ?? undefined}
          stock={product.stock ?? 0}
        />
        <AskAISimilarButton productName={product.name ?? "this car"} />
      </div>

      {/* Car Specifications */}
      <div className="mt-6 space-y-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        {product.make && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Make</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {product.make}
            </span>
          </div>
        )}
        {product.year && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Year</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {product.year}
            </span>
          </div>
        )}
        {product.fuelType && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Fuel Type</span>
            <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
              {product.fuelType}
            </span>
          </div>
        )}
        {product.engine && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Engine</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {product.engine}
            </span>
          </div>
        )}
        {product.transmission && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Transmission</span>
            <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
              {product.transmission}
            </span>
          </div>
        )}
        {product.location && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Location</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {product.location}
            </span>
          </div>
        )}
        {product.mileage && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Mileage</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {product.mileage.toLocaleString()} km
            </span>
          </div>
        )}
        {product.horsePower && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Horse Power</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {product.horsePower} HP
            </span>
          </div>
        )}
        {product.torque && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Torque</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {product.torque} Nm
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
