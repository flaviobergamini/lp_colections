"use client";

import { useRef, useState } from "react";

type Props = {
  onSelect: (file: File) => void;
  label?: string;
};

export default function CameraCapture({ onSelect, label = "Tirar foto" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    onSelect(file);
  }

  return (
    <div className="space-y-3">
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Pré-visualização"
          className="mx-auto max-h-72 w-full rounded-xl object-contain bg-black"
        />
      ) : (
        <div className="flex h-56 w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-700 text-gray-500">
          Nenhuma foto selecionada
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-lg bg-vinyl-accent py-2 font-medium text-vinyl-bg"
      >
        {label}
      </button>
    </div>
  );
}
