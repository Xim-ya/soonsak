/* 영화, 시리즈 (드라마) 유형 enum */

export type ContentType = 'movie' | 'series' | 'unknown';

interface ContentTypeConfig {
  label: string;
}

export const contentTypeConfigs: Record<ContentType, ContentTypeConfig> = {
  movie: { label: '영화' },
  series: { label: '시리즈' },
  unknown: { label: '콘텐츠' },
};
