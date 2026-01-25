import { supabaseClient } from '@/features/utils/clients/superBaseClient';
import { mapWithField } from '@/features/utils/mapper/fieldMapper';
import { ContentDto, VideoDto } from '../types';
import { CONTENT_DATABASE } from '../../utils/constants/dbName';
import { ContentType } from '@/presentation/types/content/contentType.enum';

export const contentApi = {
  /**
   * 최근 업로드된 콘텐츠 조회
   */
  getRecentUploadedContents: async (): Promise<ContentDto[]> => {
    const { data, error } = await supabaseClient
      .from(CONTENT_DATABASE.TABLES.CONTENTS)
      .select('*')
      .order(CONTENT_DATABASE.COLUMNS.UPLOADED_AT, { ascending: false });

    if (error) {
      console.error('콘텐츠 조회 실패:', error);
      throw new Error(`Failed to fetch contents: ${error.message}`);
    }

    const contents: ContentDto[] = mapWithField<ContentDto[]>(data ?? []);

    return contents ?? [];
  },

  /**
   * 특정 콘텐츠의 비디오 목록 조회
   * 정렬 순서: 1) includes_ending=true 우선, 2) runtime 긴 순서
   */
  getVideosByContent: async (contentId: number, contentType: ContentType): Promise<VideoDto[]> => {
    const { data, error } = await supabaseClient
      .from('videos')
      .select('*')
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .order('includes_ending', { ascending: false })
      .order('runtime', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('비디오 조회 실패:', error);
      throw new Error(`Failed to fetch videos: ${error.message}`);
    }

    const videos: VideoDto[] = mapWithField<VideoDto[]>(data ?? []);

    return videos ?? [];
  },

  /**
   * TMDB ID 목록으로 Supabase에 등록된 콘텐츠만 필터링하여 조회
   * @param tmdbIds TMDB 콘텐츠 ID 목록
   * @param contentType 콘텐츠 타입 (movie | tv)
   * @returns ContentDto 배열
   */
  getRegisteredContentsByTmdbIds: async (
    tmdbIds: number[],
    contentType: ContentType,
  ): Promise<ContentDto[]> => {
    if (tmdbIds.length === 0) return [];

    const { data, error } = await supabaseClient
      .from(CONTENT_DATABASE.TABLES.CONTENTS)
      .select('*')
      .in('id', tmdbIds)
      .eq('content_type', contentType);

    if (error) {
      console.error('등록된 콘텐츠 조회 실패:', error);
      throw new Error(`Failed to fetch registered contents: ${error.message}`);
    }

    return mapWithField<ContentDto[]>(data ?? []);
  },
};
