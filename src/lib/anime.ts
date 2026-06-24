import { Anime, AnimeResponse } from '@/types/anime';

const JIKAN_BASE = 'https://api.jikan.moe/v4';
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fetchWithRetry = async (page: number, retries = 3): Promise<AnimeResponse> => {
  const res = await fetch(`${JIKAN_BASE}/seasons/now?page=${page}&limit=25&sfw=true`);
  
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
    const { data: anime, pagination } = await fetchWithRetry(page);
    anime.forEach((show) => {
      if (!seenIds.has(show.mal_id)) {
        allAnime.push(show);
        seenIds.add(show.mal_id);
      }
    });
    hasNextPage = pagination.has_next_page;
    page++;
  }

  const chunked: Anime[][] = [];
  for (let i = 0; i < allAnime.length; i += 24) {
    chunked.push(allAnime.slice(i, i + 24));
  }
  return chunked;
};

export const getAnimeByIdsClient = async (ids: readonly number[]): Promise<Anime[]> => {
  const result: Anime[] = [];
  for (let i = 0; i < ids.length; i += 3) {
    const batch = ids.slice(i, i + 3);
    const batchResults = await Promise.allSettled(
      batch.map((id) =>
        fetch(`${JIKAN_BASE}/anime/${id}`).then((r) => r.json()).then((d) => d.data as Anime)
      )
    );
    batchResults.forEach((r) => {
      if (r.status === 'fulfilled' && r.value) result.push(r.value);
    });
    if (i + 3 < ids.length) await delay(1000);
  }
  return result;
};