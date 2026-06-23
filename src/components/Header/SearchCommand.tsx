'use client';

import { useState, useEffect } from 'react';
import { Search, Star, X } from 'lucide-react';
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { useAnimeFilter } from '@/components/Providers/AnimeFilterContext';

interface SearchAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  score?: number;
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchAnime[]>([]);
  const { searchQuery, setSearchQuery } = useAnimeFilter();

  // Ctrl+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Fetch results as user types
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) { setResults([]); return; }
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=8&sfw=true`
        );
        const data = await res.json();
        setResults(data.data ?? []);
      } catch (err) {
        console.error(err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (anime: SearchAnime) => {
    setSearchQuery(anime.title_english ?? anime.title);
    setOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) { setQuery(''); setResults([]); }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <>
      {/* Desktop trigger — shows active search query as label */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 h-10 w-64 rounded-xl border border-border bg-muted/50 hover:bg-muted/100 text-sm transition-colors"
      >
        <Search className="w-4 h-4 text-green-500 shrink-0" />
        <span className={searchQuery ? 'text-foreground truncate flex-1 text-left' : 'text-muted-foreground flex-1 text-left'}>
          {searchQuery || 'Search Anime'}
        </span>
        {/* X button to clear search without opening dialog */}
        {searchQuery && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); clearSearch(); }}
            className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {/* Mobile trigger */}
      <button onClick={() => setOpen(true)} className="md:hidden p-2">
        <Search className="w-5 h-5 text-green-500" />
      </button>

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search seasonal anime..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <CommandEmpty>
              {query.trim() ? 'No anime found.' : 'Start typing to search...'}
            </CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading="Anime">
                {results.map((anime) => (
                  <CommandItem
                    key={anime.mal_id}
                    value={String(anime.mal_id)}
                    onSelect={() => handleSelect(anime)}
                    className="flex items-center justify-between cursor-pointer rounded-none px-4 py-2.5"
                  >
                    <span className="text-sm">
                      {anime.title_english ?? anime.title}
                    </span>
                    {anime.score && (
                      <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold ml-4 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-yellow-400" />
                        {anime.score}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}