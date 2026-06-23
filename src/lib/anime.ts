import { Anime, AnimeResponse } from '@/types/anime';

const JIKAN_BASE = 'https://api.jikan.moe/v4';
const ITEMS_PER_PAGE = 24;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fetchWithRetry = async (
  page: number,
  retries = 3
): Promise<AnimeResponse> => {
  const url = `${JIKAN_BASE}/seasons/now?page=${page}&limit=25&sfw=true`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (res.status === 429) {
    if (retries > 0) {
      await delay(1000);
      return fetchWithRetry(page, retries - 1);
    }
    throw new Error('Rate limit exceeded after all retry attempts');
  }

  if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);
  return res.json();
};

export const getAnimeList = async (): Promise<Anime[][]> => {
  const allAnime: Anime[] = [];
  let page = 1;
  let hasNextPage = true;
  const seenIds = new Set<number>();

  while (hasNextPage) {
    await delay(350);
    const response = await fetchWithRetry(page);
    const { data: anime, pagination } = response;

    anime.forEach((show) => {
      if (!seenIds.has(show.mal_id)) {
        allAnime.push(show);
        seenIds.add(show.mal_id);
      }
    });

    hasNextPage = pagination.has_next_page;
    page++;
  }

  // Chunk into pages of ITEMS_PER_PAGE
  const chunked: Anime[][] = [];
  for (let i = 0; i < allAnime.length; i += ITEMS_PER_PAGE) {
    chunked.push(allAnime.slice(i, i + ITEMS_PER_PAGE));
  }

  return chunked;
};

const fetchTopWithRetry = async (
  page: number,
  retries = 3
): Promise<AnimeResponse> => {
  const url = `${JIKAN_BASE}/top/anime?page=${page}&limit=10&filter=bypopularity&sfw=true`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (res.status === 429) {
    if (retries > 0) {
      await delay(1000);
      return fetchTopWithRetry(page, retries - 1);
    }
    throw new Error('Rate limit exceeded after all retry attempts');
  }

  if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);
  return res.json();
};

// All-time most popular anime (Naruto, One Piece, AOT, etc.) — not
// limited to the current season, unlike getAnimeList above.
export const getTopAnime = async (count = 10): Promise<Anime[]> => {
  const result: Anime[] = [];
  const seenIds = new Set<number>();
  let page = 1;

  while (result.length < count) {
    await delay(350);
    const { data } = await fetchTopWithRetry(page);
    if (data.length === 0) break;

    for (const show of data) {
      if (!seenIds.has(show.mal_id)) {
        result.push(show);
        seenIds.add(show.mal_id);
      }
    }
    page++;
  }

  return result.slice(0, count);
};