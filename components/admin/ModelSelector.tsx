"use client";

import { useFormValue, useClient, set, unset, type StringInputProps } from "sanity";
import { useEffect, useState, useMemo, useRef } from "react";
import { Stack, TextInput, Card, Text, Box } from "@sanity/ui";

const API_VERSION = "2024-01-01"; // match whatever your studio uses elsewhere

function normalize(str: string) {
  return str
    .toLowerCase()
    .replace(/[\s\-_]+/g, "");
}

export function ModelSelector(props: StringInputProps) {
  const carTitle = useFormValue(["name"]) as string | undefined;
  const client = useClient({ apiVersion: API_VERSION });

  const [existingModels, setExistingModels] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [inputText, setInputText] = useState(props.value ?? "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const lastExternalValue = useRef(props.value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch existing models once
  useEffect(() => {
    let cancelled = false;
    client
      .fetch<string[]>(`array::unique(*[_type == "product" && defined(model)].model)`)
      .then((models) => {
        if (!cancelled) {
          setExistingModels(models.filter(Boolean));
          setLoaded(true);
        }
      })
      .catch(() => setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, [client]);

  const canonicalMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of existingModels) {
      const key = normalize(m);
      if (!map.has(key)) map.set(key, m);
    }
    return map;
  }, [existingModels]);

  // Sync local text only when value changed externally (not from our own typing)
  useEffect(() => {
    if (props.value !== lastExternalValue.current) {
      lastExternalValue.current = props.value;
      setInputText(props.value ?? "");
    }
  }, [props.value]);

  // Auto-fill from title (unchanged behavior)
  useEffect(() => {
    if (props.readOnly || props.value || !carTitle || !loaded) return;

    const words = carTitle.trim().split(/\s+/);
    const firstWord = words[0];
    const isYear = /^\d{4}$/.test(firstWord);
    const startIndex = isYear ? 2 : 1;
    const suggestedModel = words.slice(startIndex).join(" ");

    if (suggestedModel) {
      const canonical = canonicalMap.get(normalize(suggestedModel));
      const finalValue = canonical ?? suggestedModel;
      lastExternalValue.current = finalValue;
      setInputText(finalValue);
      props.onChange(set(finalValue));
    }
  }, [carTitle, props.readOnly, loaded, canonicalMap]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (!inputText) return [];
    const normalizedInput = normalize(inputText);
    return existingModels
      .filter((m) => normalize(m).includes(normalizedInput))
      .slice(0, 8);
  }, [inputText, existingModels]);

  const commitValue = (value: string) => {
    lastExternalValue.current = value || undefined;
    props.onChange(value ? set(value) : unset());
  };

  const handleTyping = (value: string) => {
    // Just type freely, no auto-correction while typing.
    setInputText(value);
    setShowSuggestions(true);
    commitValue(value);
  };

  const handleSelectSuggestion = (value: string) => {
    setInputText(value);
    setShowSuggestions(false);
    commitValue(value);
  };

  const handleBlur = () => {
    setShowSuggestions(false);
    // Only snap to canonical on an EXACT normalized match — never partial.
    const canonical = canonicalMap.get(normalize(inputText));
    if (canonical && canonical !== inputText) {
      setInputText(canonical);
      commitValue(canonical);
    }
  };

  return (
    <Stack space={0} style={{ position: "relative" }} ref={wrapperRef}>
      <TextInput
        value={inputText}
        readOnly={props.readOnly}
        placeholder="e.g. RAV4, GLA, C200"
        onChange={(e) => handleTyping(e.currentTarget.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
      />
      {showSuggestions && suggestions.length > 0 && (
        <Card
          shadow={2}
          radius={2}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 50,
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {suggestions.map((m) => (
            <Box
              key={m}
              padding={3}
              // onMouseDown fires before onBlur, so the click registers
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectSuggestion(m);
              }}
              style={{ cursor: "pointer" }}
            >
              <Text size={1}>{m}</Text>
            </Box>
          ))}
        </Card>
      )}
    </Stack>
  );
}