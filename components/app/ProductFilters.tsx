"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { FUEL_TYPES, TRANSMISSIONS, ORIGIN_TYPES, SORT_OPTIONS } from "@/lib/constants/filters";
import type { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

interface ProductFiltersProps {
  categories: ALL_CATEGORIES_QUERYResult;
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("q") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentFuelType = searchParams.get("fuelType") ?? "";
  const currentTransmission = searchParams.get("transmission") ?? "";
  const currentOrigin = searchParams.get("origin") ?? "";
  const currentSort = searchParams.get("sort") ?? "name";
  const urlMinPrice = Number(searchParams.get("minPrice")) || 0;
  const urlMaxPrice = Number(searchParams.get("maxPrice")) || 20000000;
  const currentInStock = searchParams.get("inStock") === "true";

  // Local state for price range (for smooth slider dragging)
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlMinPrice,
    urlMaxPrice,
  ]);

  // Sync local state when URL changes
  useEffect(() => {
    setPriceRange([urlMinPrice, urlMaxPrice]);
  }, [urlMinPrice, urlMaxPrice]);

  // Check which filters are active
  const isSearchActive = !!currentSearch;
  const isCategoryActive = !!currentCategory;
  const isFuelTypeActive = !!currentFuelType;
  const isTransmissionActive = !!currentTransmission;
  const isOriginActive = !!currentOrigin;
  const isPriceActive = urlMinPrice > 0 || urlMaxPrice < 20000000;
  const isInStockActive = currentInStock;

  const hasActiveFilters =
    isSearchActive ||
    isCategoryActive ||
    isFuelTypeActive ||
    isTransmissionActive ||
    isOriginActive ||
    isPriceActive ||
    isInStockActive;

  // Count active filters
  const activeFilterCount = [
    isSearchActive,
    isCategoryActive,
    isFuelTypeActive,
    isTransmissionActive,
    isOriginActive,
    isPriceActive,
    isInStockActive,
  ].filter(Boolean).length;

  const updateParams = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === 0) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    updateParams({ q: searchQuery || null });
  };

  const handleClearFilters = () => {
    router.push("/", { scroll: false });
  };

  const clearSingleFilter = (key: string) => {
    if (key === "price") {
      updateParams({ minPrice: null, maxPrice: null });
    } else {
      updateParams({ [key]: null });
    }
  };

  // Format price for display
  const formatPriceDisplay = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    return `${(price / 1000).toFixed(0)}K`;
  };

  // Helper for filter label with active indicator
  const FilterLabel = ({
    children,
    isActive,
    filterKey,
  }: {
    children: React.ReactNode;
    isActive: boolean;
    filterKey: string;
  }) => (
    <div className="mb-2 flex items-center justify-between">
      <span
        className={`block text-sm font-medium ${isActive
          ? "text-zinc-900 dark:text-zinc-100"
          : "text-zinc-700 dark:text-zinc-300"
          }`}
      >
        {children}
        {isActive && (
          <Badge className="ml-2 h-5 bg-red-500 px-1.5 text-xs text-white hover:bg-red-500">
            Active
          </Badge>
        )}
      </span>
      {isActive && (
        <button
          type="button"
          onClick={() => clearSingleFilter(filterKey)}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          aria-label={`Clear ${filterKey} filter`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Clear Filters - Show at top when active */}
      {hasActiveFilters && (
        <div className="rounded-lg border-2 border-red-300 bg-red-50 p-3 dark:border-red-700 dark:bg-red-950">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              {activeFilterCount}{" "}
              {activeFilterCount === 1 ? "filter" : "filters"} applied
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleClearFilters}
            className="w-full bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            <X className="mr-2 h-4 w-4" />
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Search */}
      <div>
        <FilterLabel isActive={isSearchActive} filterKey="q">
          Search
        </FilterLabel>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            name="search"
            placeholder="Search cars..."
            defaultValue={currentSearch}
            className={`flex-1 ${isSearchActive
              ? "border-red-500 ring-1 ring-red-500 dark:border-red-400 dark:ring-red-400"
              : ""
              }`}
          />
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
      </div>

      {/* Body Type (Category) */}
      <div>
        <FilterLabel isActive={isCategoryActive} filterKey="category">
          Make
        </FilterLabel>
        <Select
          value={currentCategory || "all"}
          onValueChange={(value) =>
            updateParams({ category: value === "all" ? null : value })
          }
        >
          <SelectTrigger
            className={
              isCategoryActive
                ? "border-red-500 ring-1 ring-red-500 dark:border-red-400 dark:ring-red-400"
                : ""
            }
          >
            <SelectValue placeholder="All Makes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Makes</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category.slug ?? ""}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type */}
      <div>
        <FilterLabel isActive={isFuelTypeActive} filterKey="fuelType">
          Fuel Type
        </FilterLabel>
        <Select
          value={currentFuelType || "all"}
          onValueChange={(value) =>
            updateParams({ fuelType: value === "all" ? null : value })
          }
        >
          <SelectTrigger
            className={
              isFuelTypeActive
                ? "border-red-500 ring-1 ring-red-500 dark:border-red-400 dark:ring-red-400"
                : ""
            }
          >
            <SelectValue placeholder="All Fuel Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuel Types</SelectItem>
            {FUEL_TYPES.map((fuel) => (
              <SelectItem key={fuel.value} value={fuel.value}>
                {fuel.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div>
        <FilterLabel isActive={isTransmissionActive} filterKey="transmission">
          Transmission
        </FilterLabel>
        <Select
          value={currentTransmission || "all"}
          onValueChange={(value) =>
            updateParams({ transmission: value === "all" ? null : value })
          }
        >
          <SelectTrigger
            className={
              isTransmissionActive
                ? "border-red-500 ring-1 ring-red-500 dark:border-red-400 dark:ring-red-400"
                : ""
            }
          >
            <SelectValue placeholder="All Transmissions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transmissions</SelectItem>
            {TRANSMISSIONS.map((trans) => (
              <SelectItem key={trans.value} value={trans.value}>
                {trans.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Origin */}
      <div>
        <FilterLabel isActive={isOriginActive} filterKey="origin">
          Origin
        </FilterLabel>
        <Select
          value={currentOrigin || "all"}
          onValueChange={(value) =>
            updateParams({ origin: value === "all" ? null : value })
          }
        >
          <SelectTrigger
            className={
              isOriginActive
                ? "border-red-500 ring-1 ring-red-500 dark:border-red-400 dark:ring-red-400"
                : ""
            }
          >
            <SelectValue placeholder="All Origins" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Origins</SelectItem>
            {ORIGIN_TYPES.map((origin) => (
              <SelectItem key={origin.value} value={origin.value}>
                {origin.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <FilterLabel isActive={isPriceActive} filterKey="price">
          Price Range: KES {formatPriceDisplay(priceRange[0])} - KES {formatPriceDisplay(priceRange[1])}
        </FilterLabel>
        <Slider
          min={0}
          max={20000000}
          step={500000}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          onValueCommit={([min, max]) =>
            updateParams({
              minPrice: min > 0 ? min : null,
              maxPrice: max < 20000000 ? max : null,
            })
          }
          className={`mt-4 ${isPriceActive ? "[&_[role=slider]]:border-red-500 [&_[role=slider]]:ring-red-500" : ""}`}
        />
      </div>

      {/* In Stock Only */}
      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={(e) =>
              updateParams({ inStock: e.target.checked ? "true" : null })
            }
            className="h-5 w-5 rounded border-zinc-300 text-red-500 focus:ring-red-500 dark:border-zinc-600 dark:bg-zinc-800"
          />
          <span
            className={`text-sm font-medium ${isInStockActive
              ? "text-zinc-900 dark:text-zinc-100"
              : "text-zinc-700 dark:text-zinc-300"
              }`}
          >
            Show only available
            {isInStockActive && (
              <Badge className="ml-2 h-5 bg-red-500 px-1.5 text-xs text-white hover:bg-red-500">
                Active
              </Badge>
            )}
          </span>
        </label>
      </div>

      {/* Sort */}
      <div>
        <span className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Sort By
        </span>
        <Select
          value={currentSort}
          onValueChange={(value) => updateParams({ sort: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
