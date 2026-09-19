"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import AlbumIcon from "@mui/icons-material/Album";
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
    <Card>
      <CardActionArea component={Link} href={`/record/${match.id}`} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
        {coverUrl ? (
          <CardMedia component="img" image={coverUrl} alt={match.title} sx={{ width: 72, height: 72, flexShrink: 0 }} />
        ) : (
          <Box sx={{ width: 72, height: 72, flexShrink: 0, bgcolor: "black", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlbumIcon color="disabled" />
          </Box>
        )}
        <CardContent sx={{ minWidth: 0, flex: 1 }}>
          <Typography noWrap sx={{ fontWeight: 500 }}>
            {match.title}
          </Typography>
          <Typography noWrap variant="body2" color="text.secondary">
            {match.artist}
          </Typography>
        </CardContent>
        <Chip label={`${percent}%`} color="primary" variant="outlined" size="small" sx={{ mr: 2 }} />
      </CardActionArea>
    </Card>
  );
}
