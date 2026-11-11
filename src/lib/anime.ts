import { Anime, AnimeResponse } from "@/types/anime";

const JIKAN_BASE = "https://api.jikan.moe/v4";
const REQUEST_TIMEOUT_MS = 5000;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Resilient Jikan fetch: timeout + retry with backoff on network errors,
// 429 and 5xx. Throws only after all retries are exhausted.
const fetchJikan = async <T,>(
  path: string,
  revalidate: number,
  retries = 1,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${JIKAN_BASE}${path}`, {
        next: { revalidate },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (res.ok) return (await res.json()) as T;

      lastError = new Error(`Jikan API error: ${res.status}`);
      // Don't retry client errors other than rate limiting
      if (res.status !== 429 && res.status < 500) break;
    } catch (err) {
      lastError = err; // timeout / network failure
    }

    if (attempt < retries) await delay(1000 * (attempt + 1));
  }

  throw lastError instanceof Error ? lastError : new Error("Jikan request failed");
};

export const getAnimeList = async (): Promise<Anime[][]> => {
  const allAnime: Anime[] = [];
  const seenIds = new Set<number>();

  for (let page = 1; page <= 4; page++) {
    try {
      const { data: anime } = await fetchJikan<AnimeResponse>(
        `/seasons/now?page=${page}&limit=25&sfw=true`,
        3600,
      );

      anime.forEach((show) => {
        if (!seenIds.has(show.mal_id)) {
          allAnime.push(show);
          seenIds.add(show.mal_id);
        }
      });
    } catch (err) {
      // Jikan unreachable from the server: stop immediately (don't make the
      // visitor wait) and let the browser load the list instead.
      console.error(`Failed to load seasonal page ${page}:`, err);
      break;
    }

    await delay(300);
  }

  const chunked: Anime[][] = [];
  for (let i = 0; i < allAnime.length; i += 24) {
    chunked.push(allAnime.slice(i, i + 24));
  }
  return chunked;
};

// Browser-side fallback: used when the server couldn't reach Jikan.
export const getSeasonalAnimeClient = async (): Promise<Anime[]> => {
  const all: Anime[] = [];
  const seen = new Set<number>();

  for (let page = 1; page <= 4; page++) {
    try {
      const res = await fetch(
        `${JIKAN_BASE}/seasons/now?page=${page}&limit=25&sfw=true`,
      );
      if (!res.ok) break;
      const json = (await res.json()) as AnimeResponse;
      json.data.forEach((show) => {
        if (!seen.has(show.mal_id)) {
          seen.add(show.mal_id);
          all.push(show);
        }
      });
    } catch {
      break;
    }
    await delay(400); // stay under Jikan's rate limit
  }

  return all;
};

// Server-side fetch with sequential requests + delay to avoid rate limiting
export const getPinnedAnime = async (
  ids: readonly number[],
): Promise<Anime[]> => {
  const results: Anime[] = [];

  for (const id of ids) {
    try {
      const res = await fetch(`${JIKAN_BASE}/anime/${id}`, {
        next: { revalidate: 86400 }, // cache for 24h — pinned titles rarely change
      });

      if (res.status === 429) {
        await delay(1000);
        // retry once
        const retry = await fetch(`${JIKAN_BASE}/anime/${id}`, {
          next: { revalidate: 86400 },
        });
        if (retry.ok) {
          const data = await retry.json();
          if (data.data) results.push(data.data);
        }
        continue;
      }

      if (!res.ok) continue;

      const data = await res.json();
      if (data.data) results.push(data.data);
    } catch {
      // skip failed individual fetch, don't break the whole list
    }

    await delay(350); // stay under Jikan's 3 req/sec limit
  }

  return results;
};

// Keep this for any remaining client-side usage
export const getAnimeByIdsClient = async (
  ids: readonly number[],
): Promise<Anime[]> => {
  const results = await Promise.allSettled(
    ids.map((id) =>
      fetch(`${JIKAN_BASE}/anime/${id}`)
        .then((r) => r.json())
        .then((d) => d.data as Anime),
    ),
  );

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<Anime>).value);
};
