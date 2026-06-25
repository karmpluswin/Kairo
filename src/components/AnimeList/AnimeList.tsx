import { getAnimeList, getPinnedAnime } from '@/lib/anime';
import { POPULAR_PINNED_MAL_IDS } from '@/lib/constants';
import AnimeGrid from './AnimeGrid';

const AnimeList = async () => {
  // Both fetched server-side — cached, consistent, no race conditions
  const [animeShows, pinnedAnime] = await Promise.all([
    getAnimeList(),
    getPinnedAnime(POPULAR_PINNED_MAL_IDS),
  ]);

  const seasonal = animeShows.flat();

  return (
    <AnimeGrid
      initialAnimePages={seasonal}
      pinnedIds={POPULAR_PINNED_MAL_IDS}
      initialPinned={pinnedAnime}
    />
  );
};

export default AnimeList;