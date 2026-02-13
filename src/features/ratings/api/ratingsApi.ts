import type { User } from '@supabase/supabase-js';
import { supabaseClient } from '@/features/utils/clients/superBaseClient';
import { mapWithField } from '@/features/utils/mapper/fieldMapper';
import type { RatingDto, SetRatingParams, RatingStatusResponse } from '../types';

const TABLE_NAME = 'content_ratings';

/**
 * 인증된 사용자 정보 반환
 * @returns 미인증 시 null
 */
async function getAuthUser(): Promise<User | null> {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) {
    return null;
  }
  return data.user ?? null;
}

/**
 * 인증된 사용자 정보 반환
 * @throws 미인증 시 에러
 */
async function requireAuth(): Promise<User> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user;
}

/**
 * 평점 API
 */
export const ratingsApi = {
  /**
   * 평점 상태 조회
   * 특정 콘텐츠에 대한 내 평점 조회
   */
  getRatingStatus: async (
    contentId: number,
    contentType: string,
  ): Promise<RatingStatusResponse> => {
    const user = await getAuthUser();
    if (!user) {
      return { hasRating: false, rating: null, ratingId: null };
    }

    const { data, error } = await supabaseClient
      .from(TABLE_NAME)
      .select('id, rating')
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .maybeSingle();

    if (error) {
      console.error('평점 상태 조회 실패:', error);
      return { hasRating: false, rating: null, ratingId: null };
    }

    if (!data || data.rating === 0) {
      return { hasRating: false, rating: null, ratingId: data?.id ?? null };
    }

    return {
      hasRating: true,
      rating: data.rating,
      ratingId: data.id,
    };
  },

  /**
   * 평점 등록/수정
   * - rating이 0.0이면 평점 취소 (삭제)
   * - 기존 평점이 있으면 수정, 없으면 등록
   */
  setRating: async (params: SetRatingParams): Promise<RatingStatusResponse> => {
    const user = await requireAuth();

    // rating이 0이면 삭제
    if (params.rating === 0) {
      await supabaseClient
        .from(TABLE_NAME)
        .delete()
        .eq('user_id', user.id)
        .eq('content_id', params.contentId)
        .eq('content_type', params.contentType);

      return { hasRating: false, rating: null, ratingId: null };
    }

    // upsert로 등록 또는 수정
    const { data, error } = await supabaseClient
      .from(TABLE_NAME)
      .upsert(
        {
          user_id: user.id,
          content_id: params.contentId,
          content_type: params.contentType,
          rating: params.rating,
        },
        {
          onConflict: 'user_id,content_id,content_type',
        },
      )
      .select()
      .single();

    if (error) {
      console.error('평점 등록/수정 실패:', error);
      throw new Error(`Failed to set rating: ${error.message}`);
    }

    const mapped = mapWithField<RatingDto>(data);
    return {
      hasRating: true,
      rating: mapped.rating,
      ratingId: mapped.id,
    };
  },

  /**
   * 평점 삭제
   */
  removeRating: async (contentId: number, contentType: string): Promise<void> => {
    const user = await requireAuth();

    const { error } = await supabaseClient
      .from(TABLE_NAME)
      .delete()
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .eq('content_type', contentType);

    if (error) {
      console.error('평점 삭제 실패:', error);
      throw new Error(`Failed to remove rating: ${error.message}`);
    }
  },
};
