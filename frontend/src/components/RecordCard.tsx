"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppContainer } from "@/infrastructure/container";
import type { VinylRecord } from "@/domain/entities/record";

export default function RecordCard({ record }: { record: VinylRecord }) {
  const { coverStorage } = useAppContainer();
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    coverStorage.getSignedUrl(record.coverPath).then((url) => {
      if (active) setCoverUrl(url);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.coverPath]);

  return (
    <Link
      href={`/record/${record.id}`}
      className="flex gap-3 rounded-xl bg-vinyl-surface p-3 hover:bg-white/5"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-black">
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt={record.title} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-gray-100">{record.title}</p>
        <p className="truncate text-sm text-gray-400">{record.artist}</p>
        <p className="text-xs text-gray-500">
          {[record.year, record.label].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}
