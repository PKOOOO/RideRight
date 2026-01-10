"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";

type ProductImages = NonNullable<
  NonNullable<PRODUCT_BY_SLUG_QUERYResult>["images"]
>;

interface ProductGalleryProps {
  images: ProductImages | null;
  productName: string | null;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // Scroll hint animation
    const hintScroll = async () => {
      // Create a small delay to make sure the user sees it
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
        setTimeout(() => {
          emblaApi.scrollPrev();
        }, 600);
      }
    };

    hintScroll();
  }, [emblaApi]);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-[3/2] items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <span className="text-zinc-400">No images available</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
        {selectedImage?.asset?.url ? (
          <Image
            src={selectedImage.asset.url}
            alt={productName ?? "Product image"}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            No image
          </div>
        )}
      </div>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <div className="relative">
          <div className="overflow-hidden py-1" ref={emblaRef}>
            <div className="flex -ml-2">
              {images.map((image, index) => (
                <div
                  key={image._key}
                  className="min-w-0 flex-[0_0_30%] pl-2 sm:flex-[0_0_25%] md:flex-[0_0_20%]"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={selectedIndex === index}
                    className={cn(
                      "relative aspect-[3/2] w-full overflow-hidden rounded-md bg-zinc-100 transition-all dark:bg-zinc-800",
                      selectedIndex === index
                        ? "ring-2 ring-offset-2 ring-red-500 dark:ring-red-400"
                        : "opacity-70 hover:opacity-100",
                    )}
                  >
                    {image.asset?.url ? (
                      <Image
                        src={image.asset.url}
                        alt={`${productName} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                        N/A
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>


        </div>
      )}
    </div>
  );
}
