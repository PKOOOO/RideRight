"use client";

import { useFormValue, set, type StringInputProps } from "sanity";
import { useEffect } from "react";
import { MAKE_MODELS } from "@/lib/constants/models";

export function ModelSelector(props: StringInputProps) {
  const categoryTitle = useFormValue(["category", "title"]) as string | undefined;
  const carTitle = useFormValue(["name"]) as string | undefined;
  const models = categoryTitle ? MAKE_MODELS[categoryTitle] ?? [] : [];

  // Auto-fill model from car title if empty
  useEffect(() => {
    if (!carTitle || props.value) return;

    // Extract words after the year (first word if it's a number)
    const words = carTitle.trim().split(/\s+/);
    const firstWord = words[0];
    const isYear = /^\d{4}$/.test(firstWord);
    
    // Skip year and make, get the model word(s)
    // e.g. "2023 Jeep Cherokee" → skip "2023" and "Jeep" → "Cherokee"
    // e.g. "Jeep Grand Cherokee" → skip "Jeep" → "Grand Cherokee"
    const startIndex = isYear ? 2 : 1;
    const suggestedModel = words.slice(startIndex).join(" ");

    if (suggestedModel) {
      props.onChange(set(suggestedModel));
    }
  }, [carTitle]);

  if (models.length === 0) {
    return props.renderDefault(props);
  }

  return props.renderDefault({
    ...props,
    schemaType: {
      ...props.schemaType,
      options: {
        list: models.map((m) => ({ title: m, value: m })),
      },
    },
  });
}