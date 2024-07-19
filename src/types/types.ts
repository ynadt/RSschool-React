import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

export interface JikanImages {
  jpg: JikanImagesCollection;
  webp?: JikanImagesCollection;
}

export interface JikanImagesCollection {
  image_url: string;
  small_image_url?: string;
  medium_image_url?: string;
  large_image_url?: string;
  maximum_image_url?: string;
}

export interface JikanResource {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface JikanResourceTitle {
  type: string;
  title: string;
}

export interface JikanResourcePeriod {
  from: string;
  to: string;
  prop: {
    from: { day: number; month: number; year: number };
    to: { day: number; month: number; year: number };
  };
  string: string;
}

export interface JikanResourceRelation {
  relation: string;
  entry: JikanResource[];
}

export interface AnimeYoutubeVideo {
  youtube_id: string;
  url: string;
  embed_url: string;
  images?: JikanImagesCollection;
}

export interface AnimeBroadcast {
  day: string;
  time: string;
  timezone: string;
  string: string;
}

export interface AnimeTheme {
  openings: string[];
  endings: string[];
}

export type AnimeType = 'TV' | 'Movie' | 'Ova' | 'Special' | 'Ona' | 'Music';
export type AnimeStatus = 'Finished Airing' | 'Currently Airing' | 'Complete' | 'Not yet aired';
export type AnimeRating = 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx';
export type AnimeSeason = 'spring' | 'summer' | 'fall' | 'winter';

export interface Anime {
  mal_id: number;
  url: string;
  images: JikanImages;
  trailer: AnimeYoutubeVideo;
  approved: boolean;
  titles: JikanResourceTitle[];
  title: string;
  title_english?: string;
  title_japanese: string;
  title_synonyms: string[];
  type: AnimeType;
  source: string;
  episodes: number;
  status: AnimeStatus;
  airing: boolean;
  aired: JikanResourcePeriod;
  duration: string;
  rating: AnimeRating;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season?: AnimeSeason;
  year: number;
  broadcast: AnimeBroadcast;
  producers: JikanResource[];
  licensors: JikanResource[];
  studios: JikanResource[];
  genres: JikanResource[];
  explicit_genres: JikanResource[];
  themes: JikanResource[];
  demographics: JikanResource[];
  relations?: JikanResourceRelation[];
  theme?: AnimeTheme;
  external?: JikanNamedResource[];
  streaming: JikanNamedResource[];
}

export interface JikanNamedResource {
  name: string;
  url: string;
}

export interface ApiJsonErrorResponse {
  status: number;
  type: string;
  message: string;
  error: string;
  report_url: string;
}

export type ApiError = FetchBaseQueryError | SerializedError | ApiJsonErrorResponse | null;
