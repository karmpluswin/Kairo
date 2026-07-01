'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnimeGenre } from '@/types/anime';

interface TrailerModalProps {
  title: string;
  trailerUrl?: string | null;
  type?: string;
  score?: number | null;
  scoredBy?: number | null;
  genres?: AnimeGenre[];
  className?: string;
}

export function TrailerModal({
  title,
  trailerUrl,
  type,
  score,
  scoredBy,
  genres,
  className,
}: TrailerModalProps) {
  const hasTrailer = Boolean(trailerUrl);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className={cn('w-full min-w-0 px-2 text-xs sm:text-sm', className)}>
          <Play className="h-3 w-3 shrink-0" />
          <span className="truncate">Trailer</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-hidden p-0 sm:max-w-3xl">
        <div className="flex flex-col gap-3 p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_2rem] items-start gap-3">
            <DialogHeader className="min-w-0 text-left">
              <DialogTitle className="truncate text-lg leading-snug">
                {title}
              </DialogTitle>
            </DialogHeader>

            <div className="flex min-w-0 max-w-[42vw] flex-nowrap items-center justify-end gap-2 overflow-hidden text-sm text-muted-foreground sm:max-w-[280px]">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Star className="h-4 w-4 shrink-0 text-yellow-400" />
                <span className="truncate">
                  {score
                    ? `${score} (${scoredBy?.toLocaleString('en-US') ?? 0})`
                    : 'N/A'}
                </span>
              </span>
              {type && (
                <Badge variant="secondary" className="shrink-0 font-semibold">
                  {type}
                </Badge>
              )}
            </div>
            <span aria-hidden="true" />
          </div>

          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {genres.map((genre) => (
                <Badge key={genre.mal_id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}

          {hasTrailer ? (
            <div className="aspect-video overflow-hidden rounded-lg bg-black">
              <iframe
                className="h-full w-full"
                src={trailerUrl ?? undefined}
                title={`${title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg border border-border bg-muted px-4 text-center text-sm text-muted-foreground">
              No trailer available.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
