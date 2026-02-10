import { supabaseClient } from '@/features/utils/clients/superBaseClient';
import { mapWithField } from '@/features/utils/mapper/fieldMapper';
import type {
  WatchHistoryDto,
  WatchHistoryWithContentDto,
  WatchHistoryCalendarItemDto,
  CreateWatchHistoryParams,
} from '../types';

const TABLE_NAME = 'watch_history';

/**
 * 시청 기록 API
 */
export const watchHistoryApi = {
  /**
   * 시청 기록 추가
   * 동일한 영상을 다시 시청하면 새 기록이 추가됨
   */
  addWatchHistory: async (params: CreateWatchHistoryParams): Promise<WatchHistoryDto> => {
    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    const now = new Date();
    const watchedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const { data, error } = await supabaseClient
      .from(TABLE_NAME)
      .insert({
        user_id: userData.user.id,
        content_id: params.contentId,
        content_type: params.contentType,
        video_id: params.videoId,
        watched_at: now.toISOString(),
        watched_date: watchedDate,
      })
      .select()
      .single();

    if (error) {
      console.error('시청 기록 추가 실패:', error);
      throw new Error(`Failed to add watch history: ${error.message}`);
    }

    return mapWithField<WatchHistoryDto>(data);
  },

  /**
   * 월별 캘린더용 시청 기록 조회
   * 날짜별로 그룹핑하여 첫 번째 포스터 이미지와 시청 횟수 반환
   */
  getCalendarHistory: async (
    year: number,
    month: number,
  ): Promise<WatchHistoryCalendarItemDto[]> => {
    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    // 월의 시작과 끝 날짜 계산
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // 해당 월의 마지막 날

    const { data, error } = await supabaseClient
      .from(TABLE_NAME)
      .select(
        `
        watched_date,
        content_id,
        contents!watch_history_content_fkey (
          poster_path
        )
      `,
      )
      .eq('user_id', userData.user.id)
      .gte('watched_date', startDate)
      .lte('watched_date', endDate)
      .order('watched_date', { ascending: true })
      .order('watched_at', { ascending: false });

    if (error) {
      console.error('캘린더 시청 기록 조회 실패:', error);
      throw new Error(`Failed to fetch calendar history: ${error.message}`);
    }

    // 날짜별로 그룹핑
    const groupedByDate = new Map<
      string,
      {
        count: number;
        firstPosterPath: string;
        contentIds: number[];
      }
    >();

    for (const item of data ?? []) {
      const date = item.watched_date;
      const existing = groupedByDate.get(date);
      const posterPath = (item.contents as { poster_path?: string } | null)?.poster_path ?? '';

      if (existing) {
        existing.count += 1;
        if (!existing.contentIds.includes(item.content_id)) {
          existing.contentIds.push(item.content_id);
        }
      } else {
        groupedByDate.set(date, {
          count: 1,
          firstPosterPath: posterPath,
          contentIds: [item.content_id],
        });
      }
    }

    // Map을 배열로 변환
    return Array.from(groupedByDate.entries()).map(([watchedDate, data]) => ({
      watchedDate,
      count: data.count,
      firstPosterPath: data.firstPosterPath,
      contentIds: data.contentIds,
    }));
  },

  /**
   * 시청 기록 목록 조회 (최신순)
   * 콘텐츠 정보 포함
   */
  getWatchHistoryList: async (
    limit: number = 20,
    offset: number = 0,
  ): Promise<{
    items: WatchHistoryWithContentDto[];
    hasMore: boolean;
    totalCount: number;
  }> => {
    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    // 전체 카운트 조회
    const { count, error: countError } = await supabaseClient
      .from(TABLE_NAME)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userData.user.id);

    if (countError) {
      console.error('시청 기록 수 조회 실패:', countError);
      throw new Error(`Failed to count watch history: ${countError.message}`);
    }

    const totalCount = count ?? 0;
    if (totalCount === 0) {
      return { items: [], hasMore: false, totalCount: 0 };
    }

    // 데이터 조회
    const { data, error } = await supabaseClient
      .from(TABLE_NAME)
      .select(
        `
        *,
        contents!watch_history_content_fkey (
          title,
          poster_path
        )
      `,
      )
      .eq('user_id', userData.user.id)
      .order('watched_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('시청 기록 목록 조회 실패:', error);
      throw new Error(`Failed to fetch watch history: ${error.message}`);
    }

    const items: WatchHistoryWithContentDto[] = (data ?? []).map((item) => ({
      ...mapWithField<WatchHistoryDto>(item),
      contentTitle: (item.contents as { title?: string } | null)?.title ?? '',
      contentPosterPath: (item.contents as { poster_path?: string } | null)?.poster_path ?? '',
    }));

    const hasMore = offset + limit < totalCount;

    return { items, hasMore, totalCount };
  },

  /**
   * 고유 콘텐츠 시청 기록 목록 조회 (중복 제거, 최신순)
   * 같은 콘텐츠를 여러 번 시청한 경우 가장 최근 기록만 반환
   */
  getUniqueContentHistory: async (
    limit: number = 20,
    offset: number = 0,
  ): Promise<{
    items: WatchHistoryWithContentDto[];
    hasMore: boolean;
  }> => {
    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    // RPC가 없으므로 클라이언트에서 처리
    // 충분한 데이터를 가져와서 중복 제거
    const fetchLimit = (offset + limit) * 3; // 여유있게 가져옴

    const { data, error } = await supabaseClient
      .from(TABLE_NAME)
      .select(
        `
        *,
        contents!watch_history_content_fkey (
          title,
          poster_path
        )
      `,
      )
      .eq('user_id', userData.user.id)
      .order('watched_at', { ascending: false })
      .limit(fetchLimit);

    if (error) {
      console.error('고유 콘텐츠 시청 기록 조회 실패:', error);
      throw new Error(`Failed to fetch unique content history: ${error.message}`);
    }

    // 콘텐츠별 중복 제거 (최신 기록만 유지)
    const seenContents = new Set<string>();
    const uniqueItems: WatchHistoryWithContentDto[] = [];

    for (const item of data ?? []) {
      const contentKey = `${item.content_id}-${item.content_type}`;
      if (!seenContents.has(contentKey)) {
        seenContents.add(contentKey);
        uniqueItems.push({
          ...mapWithField<WatchHistoryDto>(item),
          contentTitle: (item.contents as { title?: string } | null)?.title ?? '',
          contentPosterPath: (item.contents as { poster_path?: string } | null)?.poster_path ?? '',
        });
      }
    }

    // 페이지네이션 적용
    const paginatedItems = uniqueItems.slice(offset, offset + limit);
    const hasMore = uniqueItems.length > offset + limit;

    return { items: paginatedItems, hasMore };
  },

  /**
   * 시청 기록 삭제
   */
  deleteWatchHistory: async (historyId: string): Promise<void> => {
    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabaseClient
      .from(TABLE_NAME)
      .delete()
      .eq('id', historyId)
      .eq('user_id', userData.user.id);

    if (error) {
      console.error('시청 기록 삭제 실패:', error);
      throw new Error(`Failed to delete watch history: ${error.message}`);
    }
  },

  /**
   * 전체 시청 기록 삭제
   */
  clearAllWatchHistory: async (): Promise<void> => {
    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabaseClient
      .from(TABLE_NAME)
      .delete()
      .eq('user_id', userData.user.id);

    if (error) {
      console.error('전체 시청 기록 삭제 실패:', error);
      throw new Error(`Failed to clear watch history: ${error.message}`);
    }
  },
};
