/* eslint-disable @typescript-eslint/no-namespace */
import { VideoWithContentDto } from '@/features/content/types';
import { ContentType } from '@/presentation/types/content/contentType.enum';

/**
 * ChannelVideoModel - 채널 상세 페이지의 비디오 그리드 아이템 모델
 *
 * VideoWithContentDto에서 UI 표시에 필요한 필드만 추출한 Presentation Layer 모델
 */
export interface ChannelVideoModel {
  /** YouTube 비디오 ID */
  readonly id: string;
  /** 연결된 콘텐츠 ID */
  readonly contentId: number;
  /** 콘텐츠 타입 (movie/tv) */
  readonly contentType: ContentType;
  /** 콘텐츠 제목 */
  readonly contentTitle: string;
  /** 콘텐츠 포스터 이미지 경로 */
  readonly contentPosterPath: string;
}

export namespace ChannelVideoModel {
  /**
   * VideoWithContentDto를 ChannelVideoModel로 변환
   */
  export function fromDto(dto: VideoWithContentDto): ChannelVideoModel {
    return {
      id: dto.id,
      contentId: dto.contentId,
      contentType: dto.contentType!,
      contentTitle: dto.contentTitle,
      contentPosterPath: dto.contentPosterPath,
    };
  }

  /**
   * VideoWithContentDto 배열을 ChannelVideoModel 배열로 변환
   */
  export function fromDtoList(dtoList: VideoWithContentDto[]): ChannelVideoModel[] {
    return dtoList.map(fromDto);
  }
}
