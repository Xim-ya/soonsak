import type { ContentType } from '@/presentation/types/content/contentType.enum';
import type { FavoriteWithContentDto, FavoriteStatusResponse } from './index';

/**
 * FavoriteModel - 찜 UI 모델
 * FavoriteWithContentDto에서 UI에 필요한 필드만 선택
 */
export interface FavoriteModel {
  readonly id: string;
  readonly contentId: number;
  readonly contentType: ContentType;
  readonly contentTitle: string;
  readonly contentPosterPath: string;
  readonly contentBackdropPath: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FavoriteModel {
  export function fromDto(dto: FavoriteWithContentDto): FavoriteModel {
    return {
      id: dto.id,
      contentId: dto.contentId,
      contentType: dto.contentType,
      contentTitle: dto.contentTitle,
      contentPosterPath: dto.contentPosterPath,
      contentBackdropPath: dto.contentBackdropPath,
    };
  }

  export function fromDtoList(dtoList: FavoriteWithContentDto[]): FavoriteModel[] {
    return dtoList.map(fromDto);
  }
}

/**
 * FavoriteStatusModel - 찜 상태 UI 모델
 */
export interface FavoriteStatusModel {
  readonly isFavorited: boolean;
  readonly favoriteId: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FavoriteStatusModel {
  export function fromDto(dto: FavoriteStatusResponse): FavoriteStatusModel {
    return {
      isFavorited: dto.isFavorited,
      favoriteId: dto.favoriteId,
    };
  }
}
