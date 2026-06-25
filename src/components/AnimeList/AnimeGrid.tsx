"use client";

import { useState, useMemo } from "react";
import { Anime } from "@/types/anime";
import AnimeCard from "./AnimeCard";
import { useAnimeFilter } from "@/components/Providers/AnimeFilterContext";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 24;

const AnimeGrid = ({
  initialAnimePages,
  pinnedIds,
  initialPinned,
}: {
  initialAnimePages: Anime[];
  pinnedIds: readonly number[];
  initialPinned: Anime[]; // server-fetched, always complete
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { selectedGenre, searchQuery } = useAnimeFilter();

  const allAnime = useMemo(() => {
    const pinnedSet = new Set(pinnedIds);
    // Sort pinned to match the original order in POPULAR_PINNED_MAL_IDS
    const sortedPinned = [...initialPinned].sort(
      (a, b) => pinnedIds.indexOf(a.mal_id) - pinnedIds.indexOf(b.mal_id)
    );
    const seasonal = initialAnimePages.filter((a) => a && !pinnedSet.has(a.mal_id));
    return [...sortedPinned, ...seasonal];
  }, [initialPinned, initialAnimePages, pinnedIds]);

  const filtered = useMemo(() => {
    let list = allAnime;
    if (selectedGenre !== "All") {
      list = list.filter((a) => a.genres?.some((g) => g.name === selectedGenre));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.title_english ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [allAnime, selectedGenre, searchQuery]);

  const pages = useMemo(() => {
    const chunks: Anime[][] = [];
    for (let i = 0; i < filtered.length; i += ITEMS_PER_PAGE) {
      chunks.push(filtered.slice(i, i + ITEMS_PER_PAGE));
    }
    return chunks.length > 0 ? chunks : [[]];
  }, [filtered]);

  const safePage = Math.min(currentPage, pages.length - 1);
  const currentAnime = pages[safePage] ?? [];
  const totalPages = pages.length;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {(selectedGenre !== "All" || searchQuery) && (
        <p className="text-sm text-muted-foreground">
          Showing <span className="text-foreground font-medium">{filtered.length}</span> results
          {selectedGenre !== "All" && <> for <span className="text-green-500 font-medium">{selectedGenre}</span></>}
          {searchQuery && <> matching <span className="text-green-500 font-medium">&quot;{searchQuery}&quot;</span></>}
        </p>
      )}

      {currentAnime.length === 0 ? (
        <p className="text-muted-foreground mt-16 text-lg">No anime found.</p>
      ) : (
        <main className="grid grid-cols-1 place-items-center justify-center items-start lg:grid-cols-2 xl:grid-cols-3 gap-3 mb-4 mx-2 w-full max-w-[1600px] px-2 sm:px-4">
          {currentAnime.map((anime) => (
            <AnimeCard key={anime.mal_id} {...anime} />
          ))}
        </main>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                className={safePage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              >
                Previous
              </PaginationPrevious>
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={`page-${index + 1}`} className="hidden md:block">
                <PaginationLink
                  onClick={() => setCurrentPage(index)}
                  isActive={safePage === index}
                  className={safePage === index ? "bg-accent" : "cursor-pointer"}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                className={safePage === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              >
                Next
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AnimeGrid;