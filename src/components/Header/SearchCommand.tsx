'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface Anime {
  mal_id: number;
  title: string;
  score?: number;
  images: {
    webp: {
      image_url: string;
    };
  };
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        const res = await axios.get(
          `https://api.jikan.moe/v4/anime?q=${query}&limit=8`
        );

        setResults(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 h-10 w-64 rounded-xl border border-border bg-muted/50 hover:bg-muted/100"
      >
        <Search className="w-4 h-4 text-green-500" />
        <span>Search Anime</span>
      </button>

      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2"
      >
        <Search className="w-5 h-5 text-green-500" />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
  <Command>
    <CommandInput
      placeholder="Search anime..."
      value={query}
      onValueChange={setQuery}
    />

    <CommandList>
      <CommandEmpty>No anime found.</CommandEmpty>

      <CommandGroup heading="Anime">
        {results.map((anime) => (
          <CommandItem
            key={anime.mal_id}
            onSelect={() =>
              window.open(
                `https://myanimelist.net/anime/${anime.mal_id}`,
                "_blank"
              )
            }
          >
            {anime.title}
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </Command>
</CommandDialog>
    </>
  );
}