export interface AnimeImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface AnimeImages {
  jpg: AnimeImage;
  webp: AnimeImage;
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface AnimeTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
}

export interface AnimeGenre {
  mal_id: number;
  name: string;
}

export interface AnimeBroadcast {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

export interface Anime {
  mal_id: number;
  title: string;
  title_english: string | null;
  titles: AnimeTitle[];
  images: AnimeImages;
  trailer: AnimeTrailer;
  episodes: number | null;
  status: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  synopsis: string | null;
  season: string | null;
  year: number | null;
  broadcast: AnimeBroadcast;
  genres: AnimeGenre[];
  airing: boolean;
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface AnimeResponse {
  data: Anime[];
  pagination: Pagination;
}