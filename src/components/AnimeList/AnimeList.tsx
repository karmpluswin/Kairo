import { getAnimeList } from '@/lib/anime';
import AnimeGrid from './AnimeGrid';

const AnimeList = async () => {
  const animeShows = await getAnimeList();
  return <AnimeGrid initialAnimePages={animeShows} />;
};

export default AnimeList;
