// ============================================
// Car Attribute Constants
// Shared between frontend filters and Sanity schema
// ============================================

export const FUEL_TYPES = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export const TRANSMISSIONS = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
] as const;

export const SORT_OPTIONS = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_desc", label: "Year: Newest First" },
  { value: "relevance", label: "Relevance" },
] as const;

// Type exports
export type FuelTypeValue = (typeof FUEL_TYPES)[number]["value"];
export type TransmissionValue = (typeof TRANSMISSIONS)[number]["value"];
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// ============================================
// Sanity Schema Format Exports
// Format compatible with Sanity's options.list
// ============================================

/** Fuel types formatted for Sanity schema options.list */
export const FUEL_TYPES_SANITY_LIST = FUEL_TYPES.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Transmissions formatted for Sanity schema options.list */
export const TRANSMISSIONS_SANITY_LIST = TRANSMISSIONS.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Fuel type values array for zod enums or validation */
export const FUEL_TYPE_VALUES = FUEL_TYPES.map((f) => f.value) as [
  FuelTypeValue,
  ...FuelTypeValue[],
];

/** Transmission values array for zod enums or validation */
export const TRANSMISSION_VALUES = TRANSMISSIONS.map((t) => t.value) as [
  TransmissionValue,
  ...TransmissionValue[],
];
