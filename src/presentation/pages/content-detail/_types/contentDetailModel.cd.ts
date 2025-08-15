import { BaseContentModel } from '@/presentation/types/content/baseContentModel';
import { ContentType } from '@/presentation/types/content/contentType.enum';

/**
 * 콘텐츠 상세 페이지 데이터 모델
 * @extends BaseContentModel
 * - id: 콘텐츠 고유 ID
 * - title: 콘텐츠 제목
 * - type: 콘텐츠 타입 (영화, 드라마 등)
 * - posterPath: 포스터 이미지 경로
 */

export interface ContentDetailModel extends BaseContentModel {
  /** 배경 이미지 경로 */
  readonly backdropPath: string;
  /** 출시일 */
  readonly releaseDate: string;
  /** 장르 이름 목록 */
  readonly genreNames: string[];
  /** 줄거리 */
  readonly overview: string;
  /** 평점 */
  readonly voteAverage: number;
}
