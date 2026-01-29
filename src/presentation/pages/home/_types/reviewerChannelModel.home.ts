/**
 * 홈 화면 리뷰어 채널 섹션용 모델
 * Flutter ChannelModel 참고
 */
interface ReviewerChannelModel {
  readonly id: string;
  readonly name: string;
  readonly logoUrl: string;
  readonly subscriberCount: number;
}

/**
 * useReviewerChannels 훅 반환 타입
 */
interface UseReviewerChannelsResult {
  readonly data: ReviewerChannelModel[];
  readonly isLoading: boolean;
  readonly isError: boolean;
}

export type { ReviewerChannelModel, UseReviewerChannelsResult };
