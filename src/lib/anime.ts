import type { AnimeResponse } from '@/types/anime';

const JIKAN_BASE = 'https://api.jikan.moe/v4';

// Genre name → Jikan genre ID mapping
const GENRE_IDS: Record<string, number> = {
  'Action': 1,
  'Adventure': 2,
  'Avant Garde': 5,
  'Boys Love': 28,
  'Comedy': 4,
  'Drama': 8,
  'Ecchi': 9,
  'Fantasy': 10,
  'Girls Love': 26,
  'Gourmet': 47,
  'Horror': 14,
  'Mystery': 7,
  'Romance': 22,
  'Sci-Fi': 24,
  'Slice of Life': 36,
  'Sports': 30,
  'Supernatural': 37,
  'Suspense': 41,
};

interface FetchSeasonalParams {
  page?: number;
  genre?: string;
}

export async function fetchSeasonalAnime({
  page = 1,
  genre = 'All',
}: FetchSeasonalParams = {}): Promise<AnimeResponse> {
  // Build URL
  const params = new URLSearchParams({
    page: String(page),
    limit: '20',
    filter: 'tv',          // TV series only, no movies/OVA
    sfw: 'true',           // safe for work filter
  });

  if (genre !== 'All' && GENRE_IDS[genre]) {
    params.set('genres', String(GENRE_IDS[genre]));
  }

  const url = `${JIKAN_BASE}/seasons/now?${params.toString()}`;

  // Retry logic — Jikan has rate limits (3 req/sec)
  // If we get 429, wait and retry once
  const res = await fetch(url, {
    next: { revalidate: 3600 }, // ISR — cache for 1 hour
  });

  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 1000));
    const retry = await fetch(url, { next: { revalidate: 3600 } });
    if (!retry.ok) throw new Error(`Jikan API error: ${retry.status}`);
    return retry.json();
  }

  if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);
  return res.json();
}

export async function fetchAnimeById(id: number) {
  const res = await fetch(`${JIKAN_BASE}/anime/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);
  return res.json();
}

// Helper — get display title (English preferred)
export function getAnimeTitle(anime: { title: string; title_english: string | null }): string {
  return anime.title_english ?? anime.title;
}