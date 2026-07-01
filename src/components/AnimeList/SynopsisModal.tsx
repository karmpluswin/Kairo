'use client';
import React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Building2, Book } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnimeGenre } from '@/types/anime';

interface SynopsisModalProps {
  title: string;
  synopsis?: string | null;
  image: string;
  type?: string;
  score?: number | null;
  scoredBy?: number | null;
  studios?: string;
  genres?: AnimeGenre[];
  className?: string;
}

export function SynopsisModal({
  title,
  synopsis,
  image,
  type,
  score,
  scoredBy,
  studios,
  genres,
  className,
}: SynopsisModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('w-full min-w-0 px-2 text-xs sm:text-sm', className)}
        >
          <Book className="h-3 w-3 shrink-0" />
          <span className="truncate">Read Synopsis</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
        <div className="flex flex-col sm:min-h-[420px] sm:flex-row">
          {/* Poster — left panel, hidden on mobile (details/synopsis only) */}
          <div className="relative hidden w-full shrink-0 bg-black sm:block sm:h-[420px] sm:w-[280px]">
            <Image
              src={image}
              alt={title}
              fill
              quality={100}
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Details — right panel */}
          <div className="flex flex-1 flex-col gap-3 p-5 min-w-0">
            <DialogHeader className="gap-1 text-left">
              <DialogTitle className="text-xl leading-snug pr-6">
                {title}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              {type && (
                <Badge variant="secondary" className="font-semibold">
                  {type}
                </Badge>
              )}
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 shrink-0 text-yellow-400" />
                {score
                  ? `${score} (${scoredBy?.toLocaleString('en-US') ?? 0})`
                  : 'N/A'}
              </span>
              {studios && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">{studios}</span>
                </span>
              )}
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

            <div className="mt-1 max-h-[40vh] overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <p className="text-sm leading-relaxed text-foreground/90">
                {synopsis ?? 'No synopsis available.'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
