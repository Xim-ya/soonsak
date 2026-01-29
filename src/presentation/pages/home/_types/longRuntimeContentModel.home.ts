import { ContentType } from '@/presentation/types/content/contentType.enum';
import { ContentWithVideoDto } from '@/features/content/types';

/**
 * 러닝타임이 긴 콘텐츠 모델
 * 홈 화면의 러닝타임 섹션에서 사용
 */
export interface LongRuntimeContentModel {
  readonly id: number;
  readonly contentType: ContentType;
  readonly title: string;
  readonly backdropPath: string | undefined;
  readonly posterPath: string;
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
      contentType: dto.contentType,
      title: dto.title,
      backdropPath: dto.backdropPath,
      posterPath: dto.posterPath,
      runtime: dto.runtime,
      formattedRuntime: formatRuntime(dto.runtime),
    };
  }

  /**
   * 분 단위 런타임을 포맷팅된 문자열로 변환
   * @example 52 -> "52:00", 229 -> "3:49:00"
   */
  export const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:00`;
    }
    return `${mins}:00`;
  };

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
