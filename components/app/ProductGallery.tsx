"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import type { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";

type ProductImages = NonNullable<PRODUCT_BY_SLUG_QUERYResult>["images"];

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
    const hintScroll = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
        setTimeout(() => emblaApi.scrollPrev(), 600);
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
  const selectedImageUrl = selectedImage?.asset?.url;

  const handleDownload = async () => {
    if (!selectedImageUrl) return;
    const filename = `${productName ?? "car"}-image-${selectedIndex + 1}.jpg`
      .toLowerCase()
      .replace(/\s+/g, "-");
    try {
      const response = await fetch(selectedImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(selectedImageUrl, "_blank");
    }
  };

  const handleDownloadAll = async () => {
    if (!images || images.length === 0) return;
    for (let i = 0; i < images.length; i++) {
      const url = images[i]?.asset?.url;
      if (!url) continue;
      const filename = `${productName ?? "car"}-image-${i + 1}.jpg`
        .toLowerCase()
        .replace(/\s+/g, "-");
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(objectUrl);
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch {
        window.open(url, "_blank");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
        {selectedImageUrl ? (
          <>
            <Image
              src={selectedImageUrl}
              alt={productName ?? "Product image"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            {/* Left Arrow */}
            {selectedIndex > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIndex(selectedIndex - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {/* Right Arrow */}
            {selectedIndex < images.length - 1 && (
              <button
                type="button"
                onClick={() => setSelectedIndex(selectedIndex + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            {/* Download buttons */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                type="button"
                onClick={handleDownload}
                title="Download this image"
                className="flex items-center gap-1.5 rounded-md bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-black/80"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handleDownloadAll}
                  title="Download all images"
                  className="flex items-center gap-1.5 rounded-md bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-black/80"
                >
                  <Download className="h-3.5 w-3.5" />
                  All ({images.length})
                </button>
              )}
            </div>
          </>
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