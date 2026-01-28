import { supabaseClient } from '@/features/utils/clients/superBaseClient';
import { mapWithField } from '@/features/utils/mapper/fieldMapper';
import { ContentDto, VideoDto, VideoWithContentDto } from '../types';
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
   * 한글 초성 검색 지원 콘텐츠 검색
   * - 공백 무시: "그 을" → "그을린 사랑" 매칭
   * - 초성 검색: "ㄱㅇㄹ ㅅㄹ" → "그을린 사랑" 매칭
   * @param query 검색어
   * @param limit 결과 제한 (기본값: 50)
   * @returns 검색 결과 ContentDto 배열
   */
  searchContentsKorean: async (query: string, limit: number = 50): Promise<ContentDto[]> => {
    if (!query.trim()) return [];

    const { data, error } = await supabaseClient.rpc('search_contents_korean', {
      search_query: query,
      result_limit: limit,
    });

    if (error) {
      console.error('한글 검색 실패:', error);
      throw new Error(`Failed to search contents: ${error.message}`);
    }

    return mapWithField<ContentDto[]>(data ?? []);
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

  /**
   * 특정 채널의 콘텐츠 목록 조회 (DB 레벨 페이지네이션)
   * RPC 함수를 사용하여 content_id 기준 중복 제거 및 페이징 처리
   * 우선순위: is_primary > includes_ending > runtime
   * @param channelId YouTube 채널 ID
   * @param page 페이지 번호 (0부터 시작)
   * @param pageSize 페이지당 항목 수
   */
  getDistinctContentsByChannel: async (
    channelId: string,
    page: number = 0,
    pageSize: number = 20,
  ): Promise<{ videos: VideoWithContentDto[]; hasMore: boolean; totalCount: number }> => {
    const { data, error } = await supabaseClient.rpc('get_distinct_contents_by_channel', {
      p_channel_id: channelId,
      p_page: page,
      p_page_size: pageSize,
    });

    if (error) {
      console.error('채널 콘텐츠 조회 실패:', error);
      throw new Error(`Failed to fetch channel contents: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return { videos: [], hasMore: false, totalCount: 0 };
    }

    // RPC 결과를 VideoWithContentDto로 변환
    const totalCount = Number(data[0]?.total_count ?? 0);
    const videos: VideoWithContentDto[] = data.map(
      (item: {
        id: string;
        content_id: number;
        content_type: string;
        title: string;
        runtime: number | null;
        thumbnail_url: string | null;
        is_primary: boolean;
        channel_id: string;
        includes_ending: boolean;
        uploaded_at: string;
        updated_at: string;
        content_title: string;
        content_poster_path: string;
      }) => ({
        id: item.id,
        contentId: item.content_id,
        contentType: item.content_type as ContentType,
        title: item.title,
        runtime: item.runtime ?? undefined,
        thumbnailUrl: item.thumbnail_url ?? undefined,
        isPrimary: item.is_primary,
        channelId: item.channel_id,
        includesEnding: item.includes_ending,
        uploadedAt: item.uploaded_at,
        updatedAt: item.updated_at,
        contentTitle: item.content_title,
        contentPosterPath: item.content_poster_path,
      }),
    );

    const hasMore = (page + 1) * pageSize < totalCount;

    return { videos, hasMore, totalCount };
  },
};
