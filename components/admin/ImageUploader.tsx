"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useClient, type ArrayOfObjectsInputProps, insert, unset, setIfMissing } from "sanity";
import { Upload, X, Loader2, ImageIcon, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SanityImageItem {
  _type: "image";
  _key: string;
  asset: {
    _type: "reference";
    _ref: string;
  };
}

function getImageUrl(assetRef: string) {
  const match = assetRef.match(/^image-([a-zA-Z0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match) return null;
  const [, id, dimensions, format] = match;
  return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}-${dimensions}.${format}`;
}

export function ImageUploader(props: ArrayOfObjectsInputProps) {
  const { value = [], onChange } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const currentImages = value as SanityImageItem[];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    setUploadProgress(`Uploading ${files.length} image(s)...`);

    try {
      const newImages: SanityImageItem[] = [];

      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);
        const asset = await client.assets.upload("image", files[i], {
          filename: files[i].name,
        });
        newImages.push({
          _type: "image",
          _key: crypto.randomUUID(),
          asset: { _type: "reference", _ref: asset._id },
        });
      }

      onChange([
        setIfMissing([]),
        insert(newImages, "after", [-1]),
      ]);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadProgress("Upload failed.");
      setTimeout(() => setUploadProgress(null), 3000);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (key: string) => {
    onChange([unset([{_key: key}])]);
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
  if (toIndex < 0 || toIndex >= currentImages.length) return;
  const updated = [...currentImages];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  
  // unset each item individually then reinsert in new order
  const patches = [
    ...currentImages.map((img) => unset([{ _key: img._key }])),
    insert(updated, "after", [-1]),
  ];
  onChange(patches);
};
  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {uploadProgress}
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Images
          </>
        )}
      </Button>

      {currentImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {currentImages.map((image, index) => {
            const url = image.asset?._ref ? getImageUrl(image.asset._ref) : null;
            return (
              <div
                key={image._key}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800",
                  index === 0 && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900"
                )}
              >
                {url ? (
                  <Image src={url} alt="Car image" fill className="object-cover" sizes="150px" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-zinc-400" />
                  </div>
                )}

                {index === 0 && (
                  <div className="absolute left-2 top-2 rounded bg-blue-500 px-1.5 py-0.5 text-xs font-medium text-white">
                    Main
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleMove(index, index - 1)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleMove(index, index + 1)}
                      disabled={index === currentImages.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleRemove(image._key)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 py-8 dark:border-zinc-700">
          <ImageIcon className="mb-2 h-10 w-10 text-zinc-400" />
          <p className="text-sm text-zinc-500">No images uploaded</p>
          <p className="text-xs text-zinc-400">Click upload to add car images</p>
        </div>
      )}

      {currentImages.length > 0 && (
        <p className="text-xs text-zinc-500">First image is the main product image.</p>
      )}
    </div>
  );
}