/**
 * useSoonsakGrid - 무한 가상화 그리드 상태 관리 훅
 *
 * 화면에 보이는 영역만 렌더링하고, 스크롤 시 새로운 콘텐츠를 로드합니다.
 * 셀 기반으로 콘텐츠를 관리하여 무한 그리드를 구현합니다.
 */

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentApi } from '@/features/content/api/contentApi';
import { BaseContentModel } from '@/presentation/types/content/baseContentModel';
import { AppSize } from '@/shared/utils/appSize';

// 그리드 레이아웃 상수
const GRID_UNIT_WIDTH = 256;
const CARD_HEIGHT = 344;
const CARD_MARGIN = 10;
const BUFFER_CELLS = 2; // 뷰포트 밖 버퍼 셀 수
const BATCH_SIZE = 20; // 한 번에 로드할 콘텐츠 수
export const ZIGZAG_OFFSET = 192; // 지그재그 오프셋 (짝수 인덱스 셀에 적용)

interface CellPosition {
  row: number;
  col: number;
}

// position 객체 캐시 (리렌더링 시 동일 참조 유지)
const positionCache = new Map<string, CellPosition>();
const getPosition = (row: number, col: number): CellPosition => {
  const key = `${row}-${col}`;
  let position = positionCache.get(key);
  if (!position) {
    position = { row, col };
    positionCache.set(key, position);
  }
  return position;
};

interface VisibleRange {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

interface GridCell {
  position: CellPosition;
  content: BaseContentModel | null;
}

// 콘텐츠와 위치 정보 (포커스 기능용)
export interface ContentWithPosition {
  content: BaseContentModel;
  position: CellPosition;
  translateX: number; // 해당 셀을 화면 중앙에 배치하기 위한 translate 값
  translateY: number;
}

interface UseSoonsakGridReturn {
  // 그리드 상태
  cells: GridCell[];
  isLoading: boolean;
  columns: number;
  hasMoreContents: boolean;

  // 그리드 크기
  cellWidth: number;
  cellHeight: number;

  // 초기 위치 (화면 중앙에 (0,0) 셀 배치)
  initialTranslateX: number;
  initialTranslateY: number;

  // 뷰포트 업데이트
  updateViewport: (translateX: number, translateY: number) => void;

  // 랜덤 콘텐츠 선택 (포커스 기능용)
  getRandomContent: () => ContentWithPosition | null;
}

export function useSoonsakGrid(): UseSoonsakGridReturn {
  // 반응형 크기
  const cellWidth = AppSize.ratioWidth(GRID_UNIT_WIDTH);
  const cellHeight = AppSize.ratioHeight(CARD_HEIGHT) + AppSize.ratioWidth(CARD_MARGIN) * 2;

  // 화면 크기 기반 열 수 (화면에 보이는 열 수 + 버퍼)
  const screenWidth = AppSize.screenWidth;
  const screenHeight = AppSize.screenHeight;
  const visibleCols = Math.ceil(screenWidth / cellWidth) + BUFFER_CELLS * 2;
  const visibleRows = Math.ceil(screenHeight / cellHeight) + BUFFER_CELLS * 2;

  // 고정 열 수 (무한 그리드이므로 충분히 큰 값)
  const columns = 10;

  // 화면 중앙에 (0,0) 셀이 오도록 초기 translate 값 계산
  const initialTranslateX = screenWidth / 2 - cellWidth / 2;
  const initialTranslateY = screenHeight / 2 - cellHeight / 2;

  // 초기 translate 기반 뷰포트 계산
  const initialStartCol = Math.floor(-initialTranslateX / cellWidth) - BUFFER_CELLS;
  const initialStartRow = Math.floor(-initialTranslateY / cellHeight) - BUFFER_CELLS;

  // 셀-콘텐츠 매핑 (cellKey -> content)
  const [contentMap, setContentMap] = useState<Map<string, BaseContentModel>>(new Map());

  // 현재 뷰포트 범위 (초기값은 계산된 translate 기반)
  const [visibleRange, setVisibleRange] = useState<VisibleRange>({
    startRow: initialStartRow,
    endRow: initialStartRow + visibleRows,
    startCol: initialStartCol,
    endCol: initialStartCol + visibleCols,
  });

  // 로드된 콘텐츠 ID 추적 (중복 방지)
  const loadedIdsRef = useRef<Set<number>>(new Set());

  // contentMap ref (useEffect에서 최신 값 접근용)
  const contentMapRef = useRef<Map<string, BaseContentModel>>(contentMap);
  contentMapRef.current = contentMap;

  // 이전 뷰포트 (변경 감지용)
  const prevViewportRef = useRef<VisibleRange | null>(null);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 더 로드할 콘텐츠 여부
  const [hasMoreContents, setHasMoreContents] = useState(true);

  // 초기 로드 완료 여부
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  // 초기 콘텐츠 로드
  const { data: initialContents, isLoading: isInitialLoading } = useQuery({
    queryKey: ['soonsakInitialContents'],
    queryFn: async () => {
      const contents = await contentApi.getRandomContents([], BATCH_SIZE);
      return contents.map((dto) => BaseContentModel.fromContentDto(dto));
    },
    staleTime: Infinity, // 초기 로드는 한 번만
  });

  // 초기 콘텐츠를 셀에 배치 ((0,0) 중심 나선형 배치)
  useEffect(() => {
    if (!initialContents || initialContents.length === 0 || isInitialLoadDone) return;

    const newMap = new Map<string, BaseContentModel>();

    // (0,0) 중심으로 나선형 배치
    const positions: CellPosition[] = [];
    const maxRadius = Math.ceil(Math.sqrt(initialContents.length));

    for (let radius = 0; radius <= maxRadius; radius++) {
      for (let row = -radius; row <= radius; row++) {
        for (let col = -radius; col <= radius; col++) {
          if (Math.abs(row) === radius || Math.abs(col) === radius) {
            positions.push({ row, col });
          }
        }
      }
    }

    initialContents.forEach((content, index) => {
      const position = positions[index];
      if (position) {
        const key = `${position.row}-${position.col}`;
        newMap.set(key, content);
        loadedIdsRef.current.add(content.id);
      }
    });

    // ref도 즉시 업데이트 (getRandomContent에서 사용)
    contentMapRef.current = newMap;
    setContentMap(newMap);
    setIsInitialLoadDone(true);
    console.log(
      `[SoonsakGrid] 초기 로드 완료, 콘텐츠 수: ${initialContents.length}, 배치 범위: (${positions[0]?.row},${positions[0]?.col}) ~ (${positions[initialContents.length - 1]?.row},${positions[initialContents.length - 1]?.col})`,
    );
    console.log(
      `[SoonsakGrid] 현재 뷰포트: row(${visibleRange.startRow}~${visibleRange.endRow}), col(${visibleRange.startCol}~${visibleRange.endCol})`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContents]);

  // 셀 키 생성
  const getCellKey = useCallback((row: number, col: number) => `${row}-${col}`, []);

  // 뷰포트 업데이트 (드래그 위치 기반, 음수 좌표 지원)
  const updateViewport = useCallback(
    (translateX: number, translateY: number) => {
      // 현재 뷰포트의 시작 셀 계산 (음수 좌표 허용)
      const startCol = Math.floor(-translateX / cellWidth) - BUFFER_CELLS;
      const startRow = Math.floor(-translateY / cellHeight) - BUFFER_CELLS;

      const endCol = startCol + visibleCols;
      const endRow = startRow + visibleRows;

      // 뷰포트가 실제로 변경되었을 때만 업데이트
      setVisibleRange((prev) => {
        if (
          prev.startRow === startRow &&
          prev.endRow === endRow &&
          prev.startCol === startCol &&
          prev.endCol === endCol
        ) {
          return prev;
        }
        console.log(
          `[SoonsakGrid] 뷰포트 변경: row(${startRow}~${endRow}), col(${startCol}~${endCol})`,
        );
        return { startRow, endRow, startCol, endCol };
      });
    },
    [cellWidth, cellHeight, visibleCols, visibleRows],
  );

  // 뷰포트 변경 시 새 영역에 빈 셀이 있으면 로드
  useEffect(() => {
    // 초기 로드 완료 전이거나 로딩 중이면 스킵
    if (!isInitialLoadDone || isLoading || !hasMoreContents) return;

    const prev = prevViewportRef.current;

    // 첫 번째 뷰포트 변경이면 저장만 하고 리턴
    if (!prev) {
      prevViewportRef.current = visibleRange;
      return;
    }

    // 뷰포트가 실제로 변경되었는지 확인
    const hasChanged =
      prev.startRow !== visibleRange.startRow ||
      prev.endRow !== visibleRange.endRow ||
      prev.startCol !== visibleRange.startCol ||
      prev.endCol !== visibleRange.endCol;

    if (!hasChanged) return;

    // 새로 보이는 영역에 빈 셀 개수 확인 (ref로 최신 값 접근)
    const currentContentMap = contentMapRef.current;
    const MIN_EMPTY_CELLS_TO_LOAD = 10; // 빈 셀이 10개 이상일 때만 로드
    let newEmptyCellCount = 0;

    for (let row = visibleRange.startRow; row <= visibleRange.endRow; row++) {
      for (let col = visibleRange.startCol; col <= visibleRange.endCol; col++) {
        const key = getCellKey(row, col);
        if (!currentContentMap.has(key)) {
          // 이전 뷰포트에 없었던 영역인지 확인
          const wasInPrevViewport =
            row >= prev.startRow &&
            row <= prev.endRow &&
            col >= prev.startCol &&
            col <= prev.endCol;

          if (!wasInPrevViewport) {
            newEmptyCellCount++;
          }
        }
      }
    }

    prevViewportRef.current = visibleRange;

    if (newEmptyCellCount < MIN_EMPTY_CELLS_TO_LOAD) return;

    // 새 영역에 빈 셀이 충분히 있으면 로드
    const loadNewContents = async () => {
      setIsLoading(true);
      console.log(`[SoonsakGrid] 빈 셀 ${newEmptyCellCount}개 감지, 콘텐츠 로드 시작`);

      try {
        const excludeIds = Array.from(loadedIdsRef.current);
        const newContents = await contentApi.getRandomContents(excludeIds, BATCH_SIZE);

        console.log('[SoonsakGrid] 새로 로드된 콘텐츠 수:', newContents.length);

        if (newContents.length === 0) {
          console.log(
            `[SoonsakGrid] 더 이상 로드할 콘텐츠 없음, 총 로드된 콘텐츠: ${loadedIdsRef.current.size}개`,
          );
          setHasMoreContents(false);
          return;
        }

        const models = newContents.map((dto) => BaseContentModel.fromContentDto(dto));

        setContentMap((prevMap) => {
          const newMap = new Map(prevMap);

          let contentIndex = 0;
          for (
            let row = visibleRange.startRow;
            row <= visibleRange.endRow && contentIndex < models.length;
            row++
          ) {
            for (
              let col = visibleRange.startCol;
              col <= visibleRange.endCol && contentIndex < models.length;
              col++
            ) {
              const key = getCellKey(row, col);
              const content = models[contentIndex];
              if (!newMap.has(key) && content) {
                newMap.set(key, content);
                loadedIdsRef.current.add(content.id);
                contentIndex++;
              }
            }
          }

          // ref도 즉시 업데이트 (getRandomContent에서 사용)
          contentMapRef.current = newMap;
          return newMap;
        });
      } catch (error) {
        console.error('콘텐츠 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNewContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleRange, isInitialLoadDone, isLoading, hasMoreContents, getCellKey]);

  // 현재 뷰포트에 보이는 셀 목록 생성
  const cells = useMemo(() => {
    const result: GridCell[] = [];

    for (let row = visibleRange.startRow; row <= visibleRange.endRow; row++) {
      for (let col = visibleRange.startCol; col <= visibleRange.endCol; col++) {
        const key = getCellKey(row, col);
        const content = contentMap.get(key) ?? null;

        result.push({
          position: getPosition(row, col), // 캐싱된 position 사용
          content,
        });
      }
    }

    return result;
  }, [visibleRange, contentMap, getCellKey]);

  // 랜덤 콘텐츠 선택 (포커스 기능용)
  const getRandomContent = useCallback((): ContentWithPosition | null => {
    const entries = Array.from(contentMapRef.current.entries());
    console.log(`[SoonsakGrid] getRandomContent 호출, 콘텐츠 맵 크기: ${entries.length}`);
    if (entries.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * entries.length);
    const entry = entries[randomIndex];
    if (!entry) return null;

    const [key, content] = entry;
    // 음수 좌표 대응: "-1-2", "1--2", "-1--2" 등
    const match = key.match(/^(-?\d+)-(-?\d+)$/);
    if (!match || !match[1] || !match[2]) return null;

    const row = parseInt(match[1], 10);
    const col = parseInt(match[2], 10);

    // 지그재그 오프셋 계산 (짝수 인덱스 셀은 아래로 밀림)
    const globalIndex = row * columns + col;
    const isEvenIndex = globalIndex % 2 === 0;
    const zigzag = isEvenIndex ? AppSize.ratioHeight(ZIGZAG_OFFSET) : 0;

    // 해당 셀을 화면 중앙에 배치하기 위한 translate 값 계산
    // 실제 셀 Y 위치: row * cellHeight + translateY + zigzag
    const targetTranslateX = screenWidth / 2 - cellWidth / 2 - col * cellWidth;
    const targetTranslateY = screenHeight / 2 - cellHeight / 2 - row * cellHeight - zigzag;

    return {
      content,
      position: { row, col },
      translateX: targetTranslateX,
      translateY: targetTranslateY,
    };
  }, [screenWidth, screenHeight, cellWidth, cellHeight]);

  return {
    cells,
    isLoading: isLoading || isInitialLoading,
    columns,
    hasMoreContents,
    cellWidth,
    cellHeight,
    initialTranslateX,
    initialTranslateY,
    updateViewport,
    getRandomContent,
  };
}
