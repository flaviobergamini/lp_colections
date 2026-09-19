"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AlbumIcon from "@mui/icons-material/Album";
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
    <Card>
      <CardActionArea component={Link} href={`/record/${record.id}`} sx={{ display: "flex", justifyContent: "flex-start" }}>
        {coverUrl ? (
          <CardMedia component="img" image={coverUrl} alt={record.title} sx={{ width: 96, height: 96, flexShrink: 0 }} />
        ) : (
          <Box sx={{ width: 96, height: 96, flexShrink: 0, bgcolor: "black", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlbumIcon color="disabled" />
          </Box>
        )}
        <CardContent sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontWeight: 500 }}>
            {record.title}
          </Typography>
          <Typography noWrap variant="body2" color="text.secondary">
            {record.artist}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {[record.year, record.label].filter(Boolean).join(" · ")}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
