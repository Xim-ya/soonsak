/**
 * FlatList 스켈레톤 유틸리티
 * 리스트 로딩 상태에서 스켈레톤 아이템을 표시하기 위한 공통 모듈
 */

export interface SkeletonModel {
  readonly _skeleton: true;
  readonly id: string;
}

/**
 * 스켈레톤 데이터 배열 생성
 * @param count 스켈레톤 아이템 개수
 */
export function createSkeletonData(count: number): SkeletonModel[] {
  return Array.from({ length: count }, (_, i) => ({
    _skeleton: true as const,
    id: `skeleton-${i}`,
  }));
}

/**
 * 스켈레톤 아이템 타입 가드
 */
export function isSkeleton<T>(item: T | SkeletonModel): item is SkeletonModel {
  return typeof item === 'object' && item !== null && '_skeleton' in item;
}
