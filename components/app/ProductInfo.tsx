import Link from "next/link";
import { AddToCartButton } from "@/components/app/AddToCartButton";
import { AskAISimilarButton } from "@/components/app/AskAISimilarButton";
import { Badge } from "@/components/ui/badge";
import { ORIGIN_TYPES } from "@/lib/constants/filters";
import { formatPrice } from "@/lib/utils";
import type { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";
import { PortableText } from "@portabletext/react";

interface ProductInfoProps {
  product: NonNullable<PRODUCT_BY_SLUG_QUERYResult>;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const imageUrl = product.images?.[0]?.asset?.url;

  // Get vehicle condition label from origin
  const getVehicleConditionLabel = (origin: string | null | undefined): string | null => {
    if (!origin) return null;
    const originType = ORIGIN_TYPES.find((type) => type.value === origin);
    return originType?.label ?? null;
  };

  const vehicleCondition = getVehicleConditionLabel(product.origin);

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
      <div className="mt-4 flex items-center gap-3">
        <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {formatPrice(product.price)}
        </p>
        {product.originalPrice && product.originalPrice > (product.price ?? 0) && (
          <>
            <p className="text-lg text-zinc-400 line-through dark:text-zinc-500">
              {formatPrice(product.originalPrice)}
            </p>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {Math.round(((product.originalPrice - (product.price ?? 0)) / product.originalPrice) * 100)}% OFF
            </span>
          </>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-4 leading-7 space-y-3">
          <PortableText
            value={product.description as any}
            components={{
              marks: {
                strong: ({ children }) => (
                  <strong className="font-semibold">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
              },
              block: {
                normal: (props) => (
                  <p className="text-zinc-600 dark:text-zinc-400">{props.children}</p>
                ),
              },
            }}
          />
        </div>
      )}     

      {/* Vehicle Condition & Add to Cart */}
      <div className="mt-6 flex flex-col gap-3">
        {vehicleCondition && (
          <Badge
            variant="secondary"
            className="w-fit bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
          >
            {vehicleCondition}
          </Badge>
        )}
        <AddToCartButton
          productId={product._id}
          name={product.name ?? "Unknown Car"}
          slug={product.slug ?? ""}
          price={product.price ?? 0}
          image={imageUrl ?? undefined}
          stock={product.stock ?? 0}
        />
        <AskAISimilarButton productName={product.name ?? "this car"} />
      </div>

      {/* Car Specifications */}
      <div className="mt-6 space-y-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">

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
        {product.origin && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Origin</span>
            <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
              {product.origin}
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
