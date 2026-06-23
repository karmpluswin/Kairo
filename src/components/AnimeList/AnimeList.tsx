import { getAnimeList, getTopAnime } from '@/lib/anime';
import { Anime } from '@/types/anime';
import AnimeGrid from './AnimeGrid';

// How many famous all-time titles to pin into page 1.
const POPULAR_PINNED_COUNT = 6;

const AnimeList = async () => {
  const [seasonalPages, topAnime] = await Promise.all([
    getAnimeList(),
    getTopAnime(POPULAR_PINNED_COUNT),
  ]);

  const seasonal = seasonalPages.flat();
  const seasonalIds = new Set(seasonal.map((a) => a.mal_id));

  // Avoid duplicating a title that's both this season AND all-time popular
  const popularOnly = topAnime.filter((a) => !seasonalIds.has(a.mal_id));

  const ITEMS_PER_PAGE = 24;

  // Page 1 = popular titles first (in fixed order), then seasonal titles
  // fill the rest of the page. No shuffling — the famous titles should
  // be the literal first cards a visitor sees.
  const firstPageSeasonalSlots = Math.max(
    0,
    ITEMS_PER_PAGE - popularOnly.length
  );
  const page1Seasonal = seasonal.slice(0, firstPageSeasonalSlots);
  const page1 = [...popularOnly, ...page1Seasonal];

  // Remaining pages = pure seasonal, continuing right after what page 1 used
  const remainingSeasonal = seasonal.slice(firstPageSeasonalSlots);

  const animeShows: Anime[][] = [page1];
  for (let i = 0; i < remainingSeasonal.length; i += ITEMS_PER_PAGE) {
    animeShows.push(remainingSeasonal.slice(i, i + ITEMS_PER_PAGE));
  }

  return <AnimeGrid initialAnimePages={animeShows} />;
};

export default AnimeList;