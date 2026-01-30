import { supabaseClient } from '@/features/utils/clients/superBaseClient';
import { mapWithField } from '@/features/utils/mapper/fieldMapper';
import {
  ContentDto,
  ContentWithVideoDto,
  VideoDto,
  VideoWithContentDto,
  ContentCollectionDto,
  ContentCollectionWithContentsDto,
  ContentIdItem,
} from '../types';
import { CONTENT_DATABASE } from '../../utils/constants/dbConfig';
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

    const { data, error } = await supabaseClient.rpc(CONTENT_DATABASE.RPC.SEARCH_CONTENTS_KOREAN, {
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
   * includes_ending = true인 영상이 있는 콘텐츠만 반환
   * @param tmdbIds TMDB 콘텐츠 ID 목록
   * @param contentType 콘텐츠 타입 (movie | tv)
   * @returns ContentDto 배열
   */
  getRegisteredContentsByTmdbIds: async (
    tmdbIds: number[],
    contentType: ContentType,
  ): Promise<ContentDto[]> => {
    if (tmdbIds.length === 0) return [];

    const { data, error } = await supabaseClient.rpc(
      CONTENT_DATABASE.RPC.GET_REGISTERED_CONTENTS_WITH_ENDING,
      {
        p_ids: tmdbIds,
        p_content_type: contentType,
      },
    );

    if (error) {
      console.error('등록된 콘텐츠 조회 실패:', error);
      throw new Error(`Failed to fetch registered contents: ${error.message}`);
    }

    return mapWithField<ContentDto[]>(data ?? []);
  },

  /**
   * 콘텐츠 조회수 증가 (상세 페이지 진입 시)
   */
  incrementViewCount: async (contentId: number, contentType: ContentType): Promise<void> => {
    const { error } = await supabaseClient.rpc(CONTENT_DATABASE.RPC.INCREMENT_VIEW_COUNT, {
      p_content_id: contentId,
      p_content_type: contentType,
    });

    if (error) {
      console.error('조회수 증가 실패:', error);
      // 조회수 증가 실패는 사용자 경험에 영향을 주지 않으므로 throw하지 않음
    }
  },

  /**
   * 콘텐츠 재생수 증가 (영상 재생 시)
   */
  incrementPlayCount: async (contentId: number, contentType: ContentType): Promise<void> => {
    const { error } = await supabaseClient.rpc(CONTENT_DATABASE.RPC.INCREMENT_PLAY_COUNT, {
      p_content_id: contentId,
      p_content_type: contentType,
    });

    if (error) {
      console.error('재생수 증가 실패:', error);
      // 재생수 증가 실패는 사용자 경험에 영향을 주지 않으므로 throw하지 않음
    }
  },

  /**
   * 실시간 Top 콘텐츠 조회 (점수 기반)
   * 가중치: play_count × 2 + view_count × 1
   * @param limit 조회할 콘텐츠 수
   * @returns ContentDto 배열
   */
  getTopContentsByEngagement: async (limit: number = 20): Promise<ContentDto[]> => {
    const { data, error } = await supabaseClient.rpc(
      CONTENT_DATABASE.RPC.GET_TOP_CONTENTS_BY_SCORE,
      {
        p_limit: limit,
      },
    );

    if (error) {
      console.error('인기 콘텐츠 조회 실패:', error);
      throw new Error(`Failed to fetch top contents: ${error.message}`);
    }

    return mapWithField<ContentDto[]>(data ?? []);
  },

  /**
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
    const { data, error } = await supabaseClient.rpc(
      CONTENT_DATABASE.RPC.GET_DISTINCT_CONTENTS_BY_CHANNEL,
      {
        p_channel_id: channelId,
        p_page: page,
        p_page_size: pageSize,
      },
    );

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

  /**
   * 장르 기반 콘텐츠 조회
   * 특정 장르에 해당하고 includes_ending = true인 영상이 있는 콘텐츠만 반환
   * @param genreIds 장르 ID 배열
   * @param contentType 콘텐츠 타입 (movie | tv)
   * @param excludeIds 제외할 콘텐츠 ID 배열
   * @param limit 최대 조회 수 (기본값: 18)
   * @returns ContentDto 배열
   */
  getContentsByGenre: async (
    genreIds: number[],
    contentType: ContentType,
    excludeIds: number[],
    limit: number = 18,
  ): Promise<ContentDto[]> => {
    if (genreIds.length === 0) return [];

    const { data, error } = await supabaseClient.rpc(CONTENT_DATABASE.RPC.GET_CONTENTS_BY_GENRE, {
      p_genre_ids: genreIds,
      p_content_type: contentType,
      p_exclude_ids: excludeIds,
      p_limit: limit,
    });

    if (error) {
      console.error('장르 기반 콘텐츠 조회 실패:', error);
      throw new Error(`Failed to fetch contents by genre: ${error.message}`);
    }

    return mapWithField<ContentDto[]>(data ?? []);
  },

  /**
   * 러닝타임이 긴 콘텐츠 조회
   * isPrimary 비디오 중 런타임이 긴 12개를 engagement ratio 기반으로 정렬
   */
  getLongRuntimeContents: async (): Promise<ContentWithVideoDto[]> => {
    const { data, error } = await supabaseClient.rpc(
      CONTENT_DATABASE.RPC.GET_LONG_RUNTIME_CONTENTS,
    );

    if (error) {
      console.error('러닝타임 긴 콘텐츠 조회 실패:', error);
      throw new Error(`Failed to fetch long runtime contents: ${error.message}`);
    }

    return mapWithField<ContentWithVideoDto[]>(data ?? []);
  },

  /**
   * 활성화된 콘텐츠 컬렉션 목록 조회
   * display_order 기준 정렬
   */
  getActiveContentCollections: async (): Promise<ContentCollectionDto[]> => {
    const { data, error } = await supabaseClient
      .from(CONTENT_DATABASE.TABLES.CONTENT_COLLECTIONS)
      .select('id, title, subtitle, theme_keywords, content_ids, display_order, is_active')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('콘텐츠 컬렉션 조회 실패:', error);
      throw new Error(`Failed to fetch content collections: ${error.message}`);
    }

    return mapWithField<ContentCollectionDto[]>(data ?? []);
  },

  /**
   * 타입별 콘텐츠 일괄 조회
   * @param ids 조회할 콘텐츠 ID 목록
   * @param contentType 콘텐츠 타입
   */
  getContentsByTypeAndIds: async (
    ids: number[],
    contentType: ContentType,
  ): Promise<ContentDto[]> => {
    if (ids.length === 0) return [];

    const { data, error } = await supabaseClient
      .from(CONTENT_DATABASE.TABLES.CONTENTS)
      .select('*')
      .in('id', ids)
      .eq('content_type', contentType);

    if (error) {
      console.error(`콘텐츠 조회 실패 (${contentType}):`, error);
      throw new Error(`Failed to fetch ${contentType} contents: ${error.message}`);
    }

    return mapWithField<ContentDto[]>(data ?? []);
  },

  /**
   * 컬렉션에 포함된 콘텐츠 상세 정보 조회
   * content_ids 배열을 기반으로 contents 테이블에서 movie/tv 병렬 조회
   * @param contentIds 컬렉션의 콘텐츠 ID 목록
   * @returns 콘텐츠 상세 정보 배열
   */
  getContentsByCollectionIds: async (contentIds: ContentIdItem[]): Promise<ContentDto[]> => {
    if (contentIds.length === 0) return [];

    const movieIds = contentIds.filter((item) => item.type === 'movie').map((item) => item.id);
    const tvIds = contentIds.filter((item) => item.type === 'tv').map((item) => item.id);

    const [movies, tvShows] = await Promise.all([
      contentApi.getContentsByTypeAndIds(movieIds, 'movie'),
      contentApi.getContentsByTypeAndIds(tvIds, 'tv'),
    ]);

    return [...movies, ...tvShows];
  },

  /**
   * 컬렉션과 연결된 콘텐츠 상세 정보를 포함하여 조회
   * content_ids 순서를 유지하며, 중복 ID는 첫 번째만 포함
   */
  getCollectionWithContents: async (
    collection: ContentCollectionDto,
  ): Promise<ContentCollectionWithContentsDto> => {
    const contents = await contentApi.getContentsByCollectionIds(collection.contentIds);

    // 조회된 콘텐츠를 키 기반 맵으로 구성
    const contentMap = new Map<string, ContentDto>();
    contents.forEach((content) => {
      contentMap.set(`${content.id}-${content.contentType}`, content);
    });

    // contentIds 순서 유지 + 중복 제거
    const seenKeys = new Set<string>();
    const orderedContents: ContentDto[] = [];

    collection.contentIds.forEach((item) => {
      const key = `${item.id}-${item.type}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        const content = contentMap.get(key);
        if (content) {
          orderedContents.push(content);
        }
      }
    });

    const result: ContentCollectionWithContentsDto = {
      id: collection.id,
      title: collection.title,
      subtitle: collection.subtitle,
      themeKeywords: collection.themeKeywords,
      displayOrder: collection.displayOrder,
      isActive: collection.isActive,
      contents: orderedContents,
    };

    return result;
  },
};
