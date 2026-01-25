/**
 * YouTube 댓글 DTO
 * youtubei.js 라이브러리에서 반환되는 댓글 데이터 구조
 */

/**
 * 댓글 작성자 정보
 */
export interface CommentAuthorDto {
  /** 작성자 이름 */
  readonly name: string;
  /** 작성자 프로필 이미지 URL */
  readonly profileImageUrl: string;
  /** 작성자 채널 ID */
  readonly channelId?: string;
}

/**
 * 개별 댓글 DTO
 */
export interface CommentDto {
  /** 댓글 고유 ID */
  readonly id: string;
  /** 댓글 내용 (텍스트) */
  readonly content: string;
  /** 작성자 정보 */
  readonly author: CommentAuthorDto;
  /** 좋아요 수 */
  readonly likeCount: number;
  /** 좋아요 수 텍스트 (예: "1.2천") */
  readonly likeCountText?: string;
  /** 작성 시간 텍스트 (예: "3일 전") */
  readonly publishedTimeText: string;
  /** 답글 수 */
  readonly replyCount: number;
  /** 하트 표시 여부 (채널 주인이 좋아요) */
  readonly isHearted: boolean;
  /** 고정 댓글 여부 */
  readonly isPinned: boolean;
}

/**
 * 댓글 목록 응답 DTO
 */
export interface CommentsResponseDto {
  /** 댓글 목록 */
  readonly comments: CommentDto[];
  /** 총 댓글 수 텍스트 (예: "댓글 1,234개") */
  readonly totalCountText: string | undefined;
  /** 다음 페이지 토큰 (페이지네이션용) */
  readonly continuationToken?: string;
  /** 추가 댓글 존재 여부 */
  readonly hasMore: boolean;
}
