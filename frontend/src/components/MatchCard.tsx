"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppContainer } from "@/infrastructure/container";
import type { RecordMatch } from "@/domain/entities/record";

export default function MatchCard({ match }: { match: RecordMatch }) {
  const { coverStorage } = useAppContainer();
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    coverStorage.getSignedUrl(match.coverPath).then((url) => {
      if (active) setCoverUrl(url);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.coverPath]);

  const percent = Math.round(match.similarity * 100);

  return (
    <Link
      href={`/record/${match.id}`}
      className="flex items-center gap-3 rounded-xl bg-vinyl-surface p-3 hover:bg-white/5"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black">
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt={match.title} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-100">{match.title}</p>
        <p className="truncate text-sm text-gray-400">{match.artist}</p>
      </div>
      <span className="shrink-0 rounded-full bg-black/40 px-2 py-1 text-xs text-vinyl-accent">
        {percent}%
      </span>
    </Link>
  );
}
