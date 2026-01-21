import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { FUEL_TYPES_SANITY_LIST, TRANSMISSIONS_SANITY_LIST, ORIGIN_TYPES_SANITY_LIST } from "@/lib/constants/filters";

export const productType = defineType({
  name: "product",
  title: "Car",
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "media", title: "Media" },
    { name: "inventory", title: "Inventory" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Car Title",
      type: "string",
      group: "details",
      description: "e.g., '2023 Toyota Land Cruiser V8'",
      validation: (rule) => [rule.required().error("Car title is required")],
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "details",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => [
        rule.required().error("Slug is required for URL generation"),
      ],
    }),
    defineField({
      name: "description",
      type: "text",
      group: "details",
      rows: 4,
      description: "Detailed car description",
    }),
    defineField({
      name: "price",
      type: "number",
      group: "details",
      description: "Price in KES",
      validation: (rule) => [
        rule.required().error("Price is required"),
        rule.positive().error("Price must be a positive number"),
      ],
    }),
    defineField({
      name: "category",
      title: "Make",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      description: "e.g., Toyota, BMW, Mercedes",
      validation: (rule) => [rule.required().error("Make is required")],
    }),

    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "details",
      description: "Manufacturing year",
      validation: (rule) => [
        rule.required().error("Year is required"),
        rule.min(1900).error("Year must be 1900 or later"),
        rule.max(new Date().getFullYear() + 1).error("Year cannot be in the future"),
      ],
    }),
    defineField({
      name: "fuelType",
      title: "Fuel Type",
      type: "string",
      group: "details",
      options: {
        list: FUEL_TYPES_SANITY_LIST,
        layout: "radio",
      },
      validation: (rule) => [rule.required().error("Fuel type is required")],
    }),
    defineField({
      name: "engine",
      title: "Engine",
      type: "string",
      group: "details",
      description: "e.g., '5700 CC', '2000 CC Turbo'",
    }),
    defineField({
      name: "transmission",
      title: "Transmission",
      type: "string",
      group: "details",
      options: {
        list: TRANSMISSIONS_SANITY_LIST,
        layout: "radio",
      },
      validation: (rule) => [rule.required().error("Transmission is required")],
    }),
    defineField({
      name: "origin",
      title: "Vehicle condition",
      type: "string",
      group: "details",
      description:
        "Overall vehicle condition, e.g. locally used, import on behalf, foreign used (in stock or soon arriving)",
      options: {
        list: ORIGIN_TYPES_SANITY_LIST,
        layout: "radio",
      },
    }),
    defineField({
      name: "location",
      title: "Current Location",
      type: "string",
      group: "details",
      description: "e.g., 'Nairobi, Kenya'",
    }),
    defineField({
      name: "mileage",
      title: "Mileage",
      type: "number",
      group: "details",
      description: "Mileage in km",
    }),
    defineField({
      name: "horsePower",
      title: "Horse Power",
      type: "number",
      group: "details",
      description: "Engine Horse Power (HP)",
    }),
    defineField({
      name: "torque",
      title: "Torque",
      type: "number",
      group: "details",
      description: "Engine Torque (Nm)",
    }),
    defineField({
      name: "images",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (rule) => [
        rule.min(1).error("At least one image is required"),
      ],
    }),
    defineField({
      name: "stock",
      type: "number",
      group: "inventory",
      initialValue: 1,
      description: "Number of units available",
      validation: (rule) => [
        rule.min(0).error("Stock cannot be negative"),
        rule.integer().error("Stock must be a whole number"),
      ],
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Show on homepage and promotions",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      media: "images.0",
      price: "price",
      year: "year",
    },
    prepare({ title, subtitle, media, price, year }) {
      return {
        title,
        subtitle: `${subtitle ?? ""} ${year ?? ""} • KES ${(price ?? 0).toLocaleString()}`,
        media,
      };
    },
  },
});
