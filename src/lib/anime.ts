import { Anime, AnimeResponse } from '@/types/anime';
import { ITEMS_PER_PAGE } from '@/lib/constants';

const JIKAN_BASE = 'https://api.jikan.moe/v4';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fetchWithRetry = async (
  page: number,
  retries = 5
): Promise<AnimeResponse> => {
  const url = `${JIKAN_BASE}/seasons/now?page=${page}&limit=25&sfw=true`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (res.status === 429) {
    if (retries > 0) {
      await delay(3000);
      return fetchWithRetry(page, retries - 1);
    }
    throw new Error('Rate limit exceeded after all retry attempts');
  }

  if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);
  return res.json();
};

let cache: { data: Anime[][]; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 60;

export const getAnimeList = async (): Promise<Anime[][]> => {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  const allAnime: Anime[] = [];
  let page = 1;
  let hasNextPage = true;
  const seenIds = new Set<number>();

  while (hasNextPage) {
    await delay(1000);
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

  const chunked: Anime[][] = [];
  for (let i = 0; i < allAnime.length; i += ITEMS_PER_PAGE) {
    chunked.push(allAnime.slice(i, i + ITEMS_PER_PAGE));
  }

  cache = { data: chunked, timestamp: Date.now() };
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

const fetchAnimeByIdWithRetry = async (
  id: number,
  retries = 3
): Promise<Anime | null> => {
  const url = `${JIKAN_BASE}/anime/${id}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (res.status === 429) {
    if (retries > 0) {
      await delay(1000);
      return fetchAnimeByIdWithRetry(id, retries - 1);
    }
    return null;
  }

  if (!res.ok) return null;
  const { data } = await res.json();
  return data;
};

export const getAnimeByIds = async (ids: readonly number[]): Promise<Anime[]> => {
  const result: Anime[] = [];

  for (const id of ids) {
    await delay(350);
    const anime = await fetchAnimeByIdWithRetry(id);
    if (anime) result.push(anime);
  }

  return result;
};

export const getAnimeByIdsClient = async (ids: readonly number[]): Promise<Anime[]> => {
  const result: Anime[] = [];

  for (let i = 0; i < ids.length; i += 3) {
    const batch = ids.slice(i, i + 3);
    const batchResults = await Promise.allSettled(
      batch.map((id) =>
        fetch(`${JIKAN_BASE}/anime/${id}`)
          .then((r) => r.json())
          .then((d) => d.data as Anime)
      )
    );
    batchResults.forEach((r) => {
      if (r.status === 'fulfilled' && r.value) result.push(r.value);
    });
    if (i + 3 < ids.length) await delay(1000);
  }

  return result;
};