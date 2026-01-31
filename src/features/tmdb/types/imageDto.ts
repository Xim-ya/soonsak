export interface TmdbImageItemDto {
  readonly aspectRatio: number;
  readonly height: number;
  readonly iso6391: string | null;
  readonly filePath: string;
  readonly voteAverage: number;
  readonly voteCount: number;
  readonly width: number;
}

export interface TmdbImagesResponseDto {
  readonly id: number;
  readonly backdrops: TmdbImageItemDto[];
  readonly posters: TmdbImageItemDto[];
  readonly logos: TmdbImageItemDto[];
}
