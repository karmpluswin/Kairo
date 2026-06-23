"use client";

import { useState } from "react";
import { SlidersHorizontal, Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useAnimeFilter } from "@/components/Providers/AnimeFilterContext";

const GENRES = [
  "All",
  "Action",
  "Adventure",
  "Avant Garde",
  "Boys Love",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Girls Love",
  "Gourmet",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Suspense",
];

export function FilterButton() {
  const [open, setOpen] = useState(false);
  const { selectedGenre, setSelectedGenre } = useAnimeFilter();
  const isFiltered = selectedGenre !== "All";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`flex h-10 items-center gap-2 rounded-xl border transition-all text-sm
            px-2.5 md:w-52 md:px-4
            ${
              isFiltered || open
                ? "border-green-500/50 bg-green-500/10 text-green-500"
                : "border-border bg-muted/50 text-foreground hover:bg-muted"
            }`}
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          <span className="hidden md:flex flex-1 text-left font-medium truncate">
            {isFiltered ? selectedGenre : "Filter"}
          </span>
          <ChevronDown
            className={`hidden md:block w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
  align="end"
  className="w-52 p-2 rounded-xl max-h-48 overflow-y-auto scrollbar-none"
>
        <div className="space-y-1">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setSelectedGenre(genre);
                setOpen(false);
              }}
              className="flex w-full items-center rounded-lg px-3 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              {selectedGenre === genre ? (
                <Check className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <span className="mr-2 w-4" />
              )}
              {genre}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
