import { Anime, AnimeResponse } from "@/types/anime";

// api.jikan.moe has become unreliable (connect timeouts / 504s).
// Tenrai is a Jikan v4-compatible mirror, so we try it first and
// fall back to Jikan. Same paths and JSON shape on both.
const API_BASES = [
  "https://api.tenrai.org/v1",
  "https://api.jikan.moe/v4",
] as const;

const SERVER_TIMEOUT_MS = 4000;
const CLIENT_TIMEOUT_MS = 6000;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Try each API base in order. Moves on after a timeout, network error,
// 429 or 5xx. Throws only if every base fails.
async function requestApi<T>(
  path: string,
  init: RequestInit & { next?: { revalidate: number } },
  timeoutMs: number,
): Promise<T> {
  let lastError: unknown;

  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.ok) return (await res.json()) as T;

      lastError = new Error(`API error ${res.status} from ${base}`);
      if (res.status === 429) await delay(800); // brief pause, then next base
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("All anime APIs failed");
}

const fetchServer = <T,>(path: string, revalidate: number) =>
  requestApi<T>(path, { next: { revalidate } }, SERVER_TIMEOUT_MS);

const fetchClient = <T,>(path: string) =>
  requestApi<T>(path, {}, CLIENT_TIMEOUT_MS);

const chunk24 = (list: Anime[]): Anime[][] => {
  const out: Anime[][] = [];
  for (let i = 0; i < list.length; i += 24) out.push(list.slice(i, i + 24));
  return out;
};

// Server: seasonal list. Bails on the first failed page (don't make the
// visitor wait) and returns what it has; the browser fills in if empty.
export const getAnimeList = async (): Promise<Anime[][]> => {
  const allAnime: Anime[] = [];
  const seenIds = new Set<number>();

  for (let page = 1; page <= 4; page++) {
    try {
      const { data } = await fetchServer<AnimeResponse>(
        `/seasons/now?page=${page}&limit=25&sfw=true`,
        3600,
      );
      data.forEach((show) => {
        if (!seenIds.has(show.mal_id)) {
          seenIds.add(show.mal_id);
          allAnime.push(show);
        }
      });
    } catch (err) {
      console.error(`Failed to load seasonal page ${page}:`, err);
      break;
    }
    await delay(300);
  }

  return chunk24(allAnime);
};

// Browser fallback when the server couldn't load the list.
export const getSeasonalAnimeClient = async (): Promise<Anime[]> => {
  const all: Anime[] = [];
  const seen = new Set<number>();

  for (let page = 1; page <= 4; page++) {
    try {
      const { data } = await fetchClient<AnimeResponse>(
        `/seasons/now?page=${page}&limit=25&sfw=true`,
      );
      data.forEach((show) => {
        if (!seen.has(show.mal_id)) {
          seen.add(show.mal_id);
          all.push(show);
        }
      });
    } catch {
      break;
    }
    await delay(400);
  }

  return all;
};

// Browser: pinned anime by MAL id. Sequential + small delay to respect rate
// limits (parallel requests were what dropped random pinned items before).
export const getAnimeByIdsClient = async (
  ids: readonly number[],
  onEach?: (anime: Anime) => void,
): Promise<Anime[]> => {
  const results: Anime[] = [];

  for (const id of ids) {
    try {
      const { data } = await fetchClient<{ data: Anime }>(`/anime/${id}`);
      if (data) {
        results.push(data);
        onEach?.(data);
      }
    } catch {
      // skip this one, keep the rest
    }
    await delay(350);
  }

  return results;
};
