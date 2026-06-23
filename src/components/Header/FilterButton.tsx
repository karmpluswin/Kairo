'use client';

import { useState } from 'react';
import { SlidersHorizontal, Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { useAnimeFilter } from '@/components/Providers/AnimeFilterContext';

const GENRES = [
  'All', 'Action', 'Adventure', 'Avant Garde', 'Boys Love', 'Comedy',
  'Drama', 'Ecchi', 'Fantasy', 'Girls Love', 'Gourmet', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports',
  'Supernatural', 'Suspense',
];

export function FilterButton() {
  const [open, setOpen] = useState(false);
  const { selectedGenre, setSelectedGenre } = useAnimeFilter();
  const isFiltered = selectedGenre !== 'All';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`hidden md:flex h-10 items-center gap-2 px-4 w-52 rounded-xl border transition-all text-sm
            ${isFiltered || open
              ? 'border-green-500/50 bg-green-500/10 text-green-500'
              : 'border-border bg-muted/50 text-foreground hover:bg-muted'
            }`}
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-left font-medium truncate">
            {isFiltered ? selectedGenre : 'Filter'}
          </span>
          <ChevronDown
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-52 p-0 overflow-hidden rounded-xl">
        <Command>
          <CommandInput placeholder="Search genre" />
          <CommandList className="max-h-72 overflow-y-auto">
            <CommandEmpty>No genre found.</CommandEmpty>
            <CommandGroup heading="Genres">
              {GENRES.map((genre) => (
                <CommandItem
                  key={genre}
                  onSelect={() => {
                    setSelectedGenre(genre);
                    setOpen(false);
                  }}
                >
                  {selectedGenre === genre
                    ? <Check className="mr-2 h-4 w-4 text-green-500" />
                    : <span className="mr-2 w-4 inline-block" />
                  }
                  {genre}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}