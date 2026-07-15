import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price amount with currency symbol
 * @param amount - The price amount (can be null/undefined)
 * @param currency - Currency symbol (default: "KES")
 * @returns Formatted price string (e.g., "KES 2,221,899")
 */
export function formatPrice(
  amount: number | null | undefined,
  currency = "KES"
): string {
  if (amount === null || amount === undefined) {
    return `${currency} 0M`;
  }
  return `${currency} ${amount.toLocaleString('en-US')}M`;
}

type DateFormatOption = "short" | "long" | "datetime";

const DATE_FORMAT_OPTIONS: Record<
  DateFormatOption,
  Intl.DateTimeFormatOptions
> = {
  short: { day: "numeric", month: "short" },
  long: { day: "numeric", month: "long", year: "numeric" },
  datetime: {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
};
type PortableTextSpan = {
  _type: "span";
  text?: string;
  marks?: string[];
  _key?: string;
};

type PortableTextBlock = {
  _type: string;
  children?: PortableTextSpan[] | null;
  style?: string;
  listItem?: string;
  _key?: string;
};

export function portableTextToPlainText(
  blocks: PortableTextBlock[] | null | undefined
): string {
  if (!blocks) return "";
  return blocks
    .map((block) => {
      if (block._type !== "block" || !block.children) return "";
      return block.children.map((child) => child.text ?? "").join("");
    })
    .join(" ");
}

export type { PortableTextBlock };

/**
 * Format a date string with locale-specific formatting
 * @param date - ISO date string (can be null/undefined)
 * @param format - Format option: "short" (5 Jan), "long" (5 January 2025), "datetime" (5 January 2025, 14:30)
 * @param fallback - Fallback text when date is null/undefined
 * @returns Formatted date string
 */
export function formatDate(
  date: string | null | undefined,
  format: DateFormatOption = "long",
  fallback = "Date unknown"
): string {
  if (!date) return fallback;
  return new Date(date).toLocaleDateString(
    "en-GB",
    DATE_FORMAT_OPTIONS[format]
  );
}

/**
 * Format an order number for display (shows only the last segment after the last hyphen)
 * @param orderNumber - Full order number (e.g., "ORD-2024-ABC123")
 * @returns Shortened order number (e.g., "ABC123") or "N/A" if null
 */
export function formatOrderNumber(
  orderNumber: string | null | undefined
): string {
  if (!orderNumber) return "N/A";
  return orderNumber.split("-").pop() ?? orderNumber;
}
