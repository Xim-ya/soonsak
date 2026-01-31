import { ContentWithVideoDto } from '@/features/content/types';
import { BaseContentModel } from '@/presentation/types/content/baseContentModel';
import { formatter } from '@/shared/utils/formatter';

/**
 * 러닝타임이 긴 콘텐츠 모델
 * 홈 화면의 러닝타임 섹션에서 사용
 */
export interface LongRuntimeContentModel extends BaseContentModel {
  readonly backdropPath: string | undefined;
  readonly runtime: number;
  readonly formattedRuntime: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LongRuntimeContentModel {
  /**
   * DTO를 Model로 변환
   */
  export function fromDto(dto: ContentWithVideoDto): LongRuntimeContentModel {
    return {
      id: dto.id,
      type: dto.contentType,
      title: dto.title,
      posterPath: dto.posterPath ?? '',
      backdropPath: dto.backdropPath,
      runtime: dto.runtime,
      formattedRuntime: formatter.formatRuntime(dto.runtime),
    };
  }

  /**
   * Fisher-Yates 알고리즘으로 배열 셔플
   */
  export const shuffle = <T>(items: T[]): T[] => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i] as T;
      shuffled[i] = shuffled[j] as T;
      shuffled[j] = temp;
    }
    return shuffled;
  };
}
