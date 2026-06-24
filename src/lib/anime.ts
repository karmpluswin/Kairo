import { Anime, AnimeResponse } from '@/types/anime';

const JIKAN_BASE = 'https://api.jikan.moe/v4';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fetchWithRetry = async (page: number, retries = 3): Promise<AnimeResponse> => {
  const res = await fetch(
  `${JIKAN_BASE}/seasons/now?page=${page}&limit=25&sfw=true`,
  {
    next: {
      revalidate: 3600,
    },
  }
);
  
  if (res.status === 429) {
    if (retries > 0) {
      await delay(100);
      return fetchWithRetry(page, retries - 1);
    }
    throw new Error('Rate limit exceeded after all retry attempts');
  }

  if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);
  return res.json();
};

export const getAnimeList = async (): Promise<Anime[][]> => {
  const allAnime: Anime[] = [];
  const seenIds = new Set<number>();

  for (let page = 1; page <= 5; page++) {
    const { data: anime } = await fetchWithRetry(page);

    anime.forEach((show) => {
      if (!seenIds.has(show.mal_id)) {
        allAnime.push(show);
        seenIds.add(show.mal_id);
      }
    });
  }

  const chunked: Anime[][] = [];

  for (let i = 0; i < allAnime.length; i += 24) {
    chunked.push(allAnime.slice(i, i + 24));
  }

  return chunked;
};

export const getAnimeByIdsClient = async (
  ids: readonly number[]
): Promise<Anime[]> => {
  const results = await Promise.allSettled(
    ids.map((id) =>
      fetch(`${JIKAN_BASE}/anime/${id}`)
        .then((r) => r.json())
        .then((d) => d.data as Anime)
    )
  );

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<Anime>).value);
};