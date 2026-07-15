"use client";

import { useFormValue, set, type StringInputProps } from "sanity";
import { useEffect } from "react";

export function ModelSelector(props: StringInputProps) {
  const carTitle = useFormValue(["name"]) as string | undefined;

  useEffect(() => {
    // Don't auto-fill if readonly, already has value, or no title
    if (props.readOnly || props.value || !carTitle) return;

    const words = carTitle.trim().split(/\s+/);
    const firstWord = words[0];
    const isYear = /^\d{4}$/.test(firstWord);
    const startIndex = isYear ? 2 : 1;
    const suggestedModel = words.slice(startIndex).join(" ");

    if (suggestedModel) {
      props.onChange(set(suggestedModel));
    }
  }, [carTitle, props.readOnly]);

  return props.renderDefault(props);
}