import { Anime, AnimeResponse } from "@/types/anime";

const JIKAN_BASE = "https://api.jikan.moe/v4";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fetchWithRetry = async (
  page: number,
  retries = 3,
): Promise<AnimeResponse> => {
  const res = await fetch(
    `${JIKAN_BASE}/seasons/now?page=${page}&limit=25&sfw=true`,
    {
      next: {
        revalidate: 3600,
      },
    },
  );

  if (res.status === 429) {
    if (retries > 0) {
      await delay(1000);
      return fetchWithRetry(page, retries - 1);
    }

    console.error(`Rate limited on page ${page}`);

    return {
      data: [],
      pagination: {
        last_visible_page: page,
        has_next_page: false,
        current_page: page,
        items: {
          count: 0,
          total: 0,
          per_page: 25,
        },
      },
    };
  }

  if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);
  return res.json();
};

export const getAnimeList = async (): Promise<Anime[][]> => {
  const allAnime: Anime[] = [];
  const seenIds = new Set<number>();

  for (let page = 1; page <= 4; page++) {
    const { data: anime } = await fetchWithRetry(page);

    anime.forEach((show) => {
      if (!seenIds.has(show.mal_id)) {
        allAnime.push(show);
        seenIds.add(show.mal_id);
      }
    });

    await delay(300);
  }

  const chunked: Anime[][] = [];

  for (let i = 0; i < allAnime.length; i += 24) {
    chunked.push(allAnime.slice(i, i + 24));
  }

  return chunked;
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