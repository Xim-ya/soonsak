/* eslint-disable @typescript-eslint/no-namespace */
import { CommentDto } from '@/features/youtube/types';
import { formatter } from '@/shared/utils/formatter';

/**
 * CommentModel - YouTube 댓글 모델
 *
 * 댓글 목록 UI에서 사용하는 댓글 정보 모델
 */
export interface CommentModel {
  /** 댓글 고유 ID */
  readonly id: string;
  /** 댓글 내용 */
  readonly content: string;
  /** 작성자 이름 */
  readonly authorName: string;
  /** 작성자 프로필 이미지 URL */
  readonly authorProfileImageUrl: string;
  /** 좋아요 수 텍스트 (예: "1.2천") */
  readonly likeCountText: string;
  /** 작성 시간 텍스트 (예: "3일 전") */
  readonly publishedTimeText: string;
  /** 답글 수 */
  readonly replyCount: number;
  /** 하트 표시 여부 */
  readonly isHearted: boolean;
  /** 고정 댓글 여부 */
  readonly isPinned: boolean;
}

export namespace CommentModel {
  /**
   * CommentDto를 CommentModel로 변환
   */
  export function fromDto(dto: CommentDto): CommentModel {
    return {
      id: dto.id,
      content: dto.content,
      authorName: dto.author.name,
      authorProfileImageUrl: dto.author.profileImageUrl,
      likeCountText:
        dto.likeCountText ||
        (dto.likeCount > 0 ? formatter.formatNumberWithUnit(dto.likeCount) : ''),
      publishedTimeText: dto.publishedTimeText,
      replyCount: dto.replyCount,
      isHearted: dto.isHearted,
      isPinned: dto.isPinned,
    };
  }

  /**
   * CommentDto 배열을 CommentModel 배열로 변환
   */
  export function fromDtoList(dtoList: CommentDto[]): CommentModel[] {
    return dtoList.map(fromDto);
  }
}
