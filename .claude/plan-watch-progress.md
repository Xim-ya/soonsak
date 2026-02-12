# 시청 진행률 (Watch Progress) 기능 구현 계획

## 개요
시청 기록에 진행률을 추가하여 YouTube 스타일의 빨간색 프로그레스 바를 표시하고, 백드롭 이미지를 사용하도록 개선합니다.

## 구현 단계

### 1단계: DB 마이그레이션
**파일**: Supabase Migration

```sql
ALTER TABLE watch_history
ADD COLUMN progress_seconds INTEGER DEFAULT 0,
ADD COLUMN duration_seconds INTEGER DEFAULT 0;
```

- `progress_seconds`: 현재 시청 위치 (초)
- `duration_seconds`: 영상 총 길이 (초)

---

### 2단계: 타입 정의 수정
**파일**: `src/features/watch-history/types/index.ts`

```typescript
// WatchHistoryWithContentDto에 추가
export interface WatchHistoryWithContentDto {
  // 기존 필드들...
  progressSeconds: number;
  durationSeconds: number;
  backdropPath: string | null;  // posterPath 대신 backdropPath 사용
}

// 진행률 업데이트용 파라미터
export interface UpdateWatchProgressParams {
  contentId: number;
  contentType: ContentType;
  videoId: string;
  progressSeconds: number;
  durationSeconds: number;
}
```

---

### 3단계: API 수정
**파일**: `src/features/watch-history/api/watchHistoryApi.ts`

1. `getUniqueContentHistory` 쿼리에 `backdrop_path` 추가
2. 새 함수 추가:
```typescript
async updateWatchProgress(params: UpdateWatchProgressParams): Promise<void> {
  // upsert: 기존 기록이 있으면 업데이트, 없으면 생성
}
```

---

### 4단계: useWatchProgressSync 훅 생성
**파일**: `src/features/watch-history/hooks/useWatchProgressSync.ts`

```typescript
export function useWatchProgressSync(params: {
  contentId: number;
  contentType: ContentType;
  videoId: string;
  enabled: boolean;
}) {
  // 상태
  const progressRef = useRef(0);
  const durationRef = useRef(0);

  // 동기화 로직
  const syncProgress = useCallback(() => {
    // API 호출
  }, []);

  // 진행률 업데이트 (외부에서 호출)
  const updateProgress = useCallback((progress: number, duration: number) => {
    progressRef.current = progress;
    durationRef.current = duration;
  }, []);

  // 즉시 동기화 (일시정지, 페이지 이탈 시)
  const syncNow = useCallback(() => {
    syncProgress();
  }, []);

  // 20초 인터벌 동기화
  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(syncProgress, 20000);
    return () => clearInterval(interval);
  }, [enabled, syncProgress]);

  return { updateProgress, syncNow };
}
```

---

### 5단계: PlayerPage 수정
**파일**: `src/presentation/pages/player/PlayerPage.tsx`

1. `useWatchProgressSync` 훅 사용
2. YouTube 플레이어 이벤트에서 진행률 업데이트:
   - `onStateChange`: 상태가 PLAYING(1)일 때 진행률 추적 시작
   - `onStateChange`: 상태가 PAUSED(2)일 때 `syncNow()` 호출
3. 페이지 이탈 시 동기화:
   - `useEffect` cleanup에서 `syncNow()` 호출
   - `beforeRemove` 네비게이션 이벤트에서 `syncNow()` 호출

```typescript
// 진행률 추적
useEffect(() => {
  if (playerState !== 1) return; // PLAYING이 아니면 return

  const interval = setInterval(() => {
    playerRef.current?.getCurrentTime().then((time) => {
      updateProgress(Math.floor(time), duration);
    });
  }, 1000); // 1초마다 현재 시간 업데이트

  return () => clearInterval(interval);
}, [playerState, duration, updateProgress]);
```

---

### 6단계: WatchHistoryList UI 수정
**파일**: `src/presentation/pages/my/_components/WatchHistoryList.tsx`

1. 포스터 이미지 → 백드롭 이미지로 변경
2. 이미지 하단에 빨간색 프로그레스 바 추가:

```typescript
// 프로그레스 바 컴포넌트
const ProgressBar = styled.View<{ progress: number }>((props) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: 3,
  width: `${props.progress}%`,
  backgroundColor: colors.red, // YouTube 스타일 빨간색
}));

// 진행률 계산
const progressPercent = durationSeconds > 0
  ? Math.min((progressSeconds / durationSeconds) * 100, 100)
  : 0;
```

---

## 동기화 전략 요약

| 트리거 | 동작 |
|--------|------|
| 20초 간격 | 백그라운드에서 자동 동기화 |
| 일시정지 시 | 즉시 동기화 |
| 페이지 이탈 시 | 즉시 동기화 |

---

## 파일 변경 목록

1. `Supabase Migration` - DB 스키마 수정
2. `src/features/watch-history/types/index.ts` - 타입 추가
3. `src/features/watch-history/api/watchHistoryApi.ts` - API 함수 수정/추가
4. `src/features/watch-history/hooks/useWatchProgressSync.ts` - 신규 훅
5. `src/features/watch-history/hooks/index.ts` - export 추가
6. `src/presentation/pages/player/PlayerPage.tsx` - 진행률 추적 로직
7. `src/presentation/pages/my/_components/WatchHistoryList.tsx` - UI 변경
