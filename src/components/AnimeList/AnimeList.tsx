import { getAnimeList } from '@/lib/anime';
import { POPULAR_PINNED_MAL_IDS } from '@/lib/constants';
import AnimeGrid from './AnimeGrid';

const AnimeList = async () => {
  const animeShows = await getAnimeList();
  const seasonal = animeShows.flat();

  return (
    <AnimeGrid
      initialAnimePages={seasonal}
      pinnedIds={POPULAR_PINNED_MAL_IDS}
    />
  );
};

export default AnimeList;