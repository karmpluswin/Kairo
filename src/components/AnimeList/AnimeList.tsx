import { getAnimeList, getAnimeByIds } from '@/lib/anime';
import { POPULAR_PINNED_MAL_IDS } from '@/lib/constants';
import AnimeGrid from './AnimeGrid';

const ITEMS_PER_PAGE = 24;

const AnimeList = async () => {
  const [seasonalPages, pinnedAnime] = await Promise.all([
    getAnimeList(),
    getAnimeByIds(POPULAR_PINNED_MAL_IDS),
  ]);

  const pinnedIds = new Set<number>(POPULAR_PINNED_MAL_IDS);

  // Drop pinned titles from seasonal so they only appear once at the front
  const seasonal = seasonalPages
    .flat()
    .filter((a) => !pinnedIds.has(a.mal_id));

  const firstPageSeasonalSlots = Math.max(
    0,
    ITEMS_PER_PAGE - pinnedAnime.length
  );
  const page1 = [...pinnedAnime, ...seasonal.slice(0, firstPageSeasonalSlots)];

  const remainingSeasonal = seasonal.slice(firstPageSeasonalSlots);

  const animeShows = [page1];
  for (let i = 0; i < remainingSeasonal.length; i += ITEMS_PER_PAGE) {
    animeShows.push(remainingSeasonal.slice(i, i + ITEMS_PER_PAGE));
  }

  return <AnimeGrid initialAnimePages={animeShows} />;
};

export default AnimeList;
