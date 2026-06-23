'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AnimeFilterContextType {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AnimeFilterContext = createContext<AnimeFilterContextType>({
  selectedGenre: 'All',
  setSelectedGenre: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
});

export function AnimeFilterProvider({ children }: { children: ReactNode }) {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AnimeFilterContext.Provider
      value={{ selectedGenre, setSelectedGenre, searchQuery, setSearchQuery }}
    >
      {children}
    </AnimeFilterContext.Provider>
  );
}

export const useAnimeFilter = () => useContext(AnimeFilterContext);