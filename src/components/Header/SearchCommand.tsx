"use client";

import { useState, useEffect } from "react";
import { Search, Star, X } from "lucide-react";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useAnimeFilter } from "@/components/Providers/AnimeFilterContext";

interface SearchAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  score?: number;
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchAnime[]>([]);
  const [defaultResults, setDefaultResults] = useState<SearchAnime[]>([]);
  const { searchQuery, setSearchQuery } = useAnimeFilter();

  // Ctrl+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch a default "all-time most popular" list once, on first open
  useEffect(() => {
    if (!open || defaultResults.length > 0) return;
    (async () => {
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/top/anime?limit=6&filter=bypopularity&sfw=true`,
        );
        const data = await res.json();
        const list: SearchAnime[] = data.data ?? [];
        const seen = new Set<number>();
        const deduped = list.filter((anime) => {
          if (seen.has(anime.mal_id)) return false;
          seen.add(anime.mal_id);
          return true;
        });
        setDefaultResults(deduped);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [open, defaultResults.length]);

  // Fetch results as user types
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=6&sfw=true`,
        );
        const data = await res.json();
        const list: SearchAnime[] = data.data ?? [];
        const seen = new Set<number>();
        const deduped = list.filter((anime) => {
          if (seen.has(anime.mal_id)) return false;
          seen.add(anime.mal_id);
          return true;
        });
        setResults(deduped);
      } catch (err) {
        console.error(err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const shownResults = query.trim() ? results : defaultResults;
  const listHeading = query.trim() ? "Anime" : "Most Popular";

  const handleSelect = (anime: SearchAnime) => {
    setSearchQuery(anime.title_english ?? anime.title);
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setQuery("");
      setResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      {/* Desktop trigger — shows active search query as label */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 h-10 w-44 lg:w-80 rounded-xl border border-border bg-muted/50 hover:bg-muted/100 text-sm transition-colors"
      >
        <Search className="w-4 h-4 text-green-500 shrink-0" />
        <span
          className={
            searchQuery
              ? "text-foreground truncate flex-1 text-left"
              : "text-muted-foreground flex-1 text-left"
          }
        >
          {searchQuery || "Search Anime"}
        </span>
        {/* X button to clear search without opening dialog */}
        {searchQuery && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              clearSearch();
            }}
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
          <CommandList className="max-h-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <CommandEmpty>
              {query.trim() ? "No anime found." : "Start typing to search..."}
            </CommandEmpty>

            {shownResults.length > 0 && (
              <CommandGroup
                heading={listHeading}
                className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider"
              >
                {shownResults.slice(0, 6).map((anime) => (
                  <CommandItem
                    key={anime.mal_id}
                    value={String(anime.mal_id)}
                    onSelect={() => handleSelect(anime)}
                    className="
            mx-2 my-1
            rounded-lg
            px-4 py-3
            cursor-pointer
            border border-transparent
            hover:bg-muted
            hover:border-border
            transition-all
          "
                  >
                    <div className="flex items-center justify-between w-full gap-4 min-w-0">
                      <span className="truncate flex-1 font-medium text-sm">
                        {anime.title_english ?? anime.title}
                      </span>

                      {anime.score && (
                        <div className="flex items-center gap-1 whitespace-nowrap shrink-0">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                          <span className="text-sm font-semibold text-yellow-400">
                            {anime.score.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
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
