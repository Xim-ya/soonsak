---
name: react-native-expert
description: React Native 성능 최적화 전문가. Vercel react-best-practices 스타일의 50+ 규칙으로 코드 품질, 성능, 스타일링을 담당합니다.
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

# React Native Best Practices

> React Native 성능 최적화 가이드 - 8개 카테고리, 50+ 규칙, 영향도별 우선순위화

## 적용 시나리오

다음 상황에서 이 가이드를 참조하세요:
- React Native 컴포넌트 작성/수정
- 데이터 페칭 구현
- 성능 이슈 코드 리뷰
- 번들 크기/로딩 시간 최적화
- 스타일링 및 반응형 디자인

---

# 1. 비동기 워터폴 제거

**영향도: CRITICAL**

워터폴은 성능의 최대 적입니다. 순차적 await는 전체 네트워크 지연을 누적시킵니다.

## 규칙 1.1: 병렬 가능한 요청은 Promise.all 사용

❌ 잘못된 방식:
```typescript
async function loadContentDetail(contentId: string) {
  const content = await fetchContent(contentId);
  const cast = await fetchCast(contentId);
  const videos = await fetchVideos(contentId);
  return { content, cast, videos };
}
```

✅ 올바른 방식:
```typescript
async function loadContentDetail(contentId: string) {
  const [content, cast, videos] = await Promise.all([
    fetchContent(contentId),
    fetchCast(contentId),
    fetchVideos(contentId),
  ]);
  return { content, cast, videos };
}
```

## 규칙 1.2: 조건부 로직은 await 전에 평가

❌ 잘못된 방식:
```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId);
  if (skipProcessing) {
    return { skipped: true };
  }
  return processUserData(userData);
}
```

✅ 올바른 방식:
```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    return { skipped: true };
  }
  const userData = await fetchUserData(userId);
  return processUserData(userData);
}
```

## 규칙 1.3: 의존성 있는 요청만 순차 처리

```typescript
// 의존성 분석 후 최적화
async function loadUserDashboard(userId: string) {
  // Step 1: 사용자 정보 (의존성 없음)
  const user = await fetchUser(userId);

  // Step 2: 사용자 정보에 의존하는 데이터 (병렬 처리)
  const [channels, favorites, history] = await Promise.all([
    fetchUserChannels(user.subscriptionIds),
    fetchUserFavorites(user.id),
    fetchWatchHistory(user.id),
  ]);

  return { user, channels, favorites, history };
}
```

---

# 2. 번들 크기 최적화

**영향도: CRITICAL**

## 규칙 2.1: Dynamic Import로 코드 스플리팅

❌ 잘못된 방식:
```typescript
import { HeavyChartLibrary } from 'heavy-chart-lib';
import { ComplexAnimationLib } from 'complex-animation';

function AnalyticsScreen() {
  return <HeavyChartLibrary data={data} />;
}
```

✅ 올바른 방식:
```typescript
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('heavy-chart-lib'));

function AnalyticsScreen() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyChart data={data} />
    </Suspense>
  );
}
```

## 규칙 2.2: Barrel File(index.ts) 주의

❌ 잘못된 방식:
```typescript
// utils/index.ts - 전체 번들 포함됨
export * from './string';
export * from './date';
export * from './crypto'; // 큰 라이브러리

// 사용처
import { formatDate } from '@/utils'; // crypto도 번들에 포함!
```

✅ 올바른 방식:
```typescript
// 직접 임포트
import { formatDate } from '@/utils/date';
```

## 규칙 2.3: 라이브러리 서브패스 임포트

❌ 잘못된 방식:
```typescript
import { format } from 'date-fns'; // 전체 라이브러리 로드
```

✅ 올바른 방식:
```typescript
import format from 'date-fns/format'; // 필요한 함수만 로드
```

---

# 3. 스타일링 시스템

**영향도: HIGH**

## 규칙 3.1: StyleSheet 금지, Emotion Native 사용

❌ 잘못된 방식:
```typescript
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: { backgroundColor: '#000' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
});

function Component() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title</Text>
    </View>
  );
}
```

✅ 올바른 방식:
```typescript
import styled from '@emotion/native';
import textStyles from '@/shared/styles/textStyles';
import colors from '@/shared/styles/colors';

const Container = styled.View({
  backgroundColor: colors.black,
});

const Title = styled.Text({
  ...textStyles.headline2,
  color: colors.white,
});

function Component() {
  return (
    <Container>
      <Title>Title</Title>
    </Container>
  );
}
```

## 규칙 3.2: 직접 색상/폰트 값 금지

❌ 잘못된 방식:
```typescript
const Title = styled.Text({
  fontSize: 20,
  fontWeight: '700',
  color: '#FFFFFF',
});
```

✅ 올바른 방식:
```typescript
const Title = styled.Text({
  ...textStyles.headline2,
  color: colors.white,
});
```

## 규칙 3.3: 반응형 크기에 AppSize 사용

❌ 잘못된 방식:
```typescript
const Container = styled.View({
  width: 196,
  height: 110,
  paddingHorizontal: 16,
});
```

✅ 올바른 방식:
```typescript
import { AppSize } from '@/shared/utils/appSize';

const thumbnailWidth = AppSize.ratioWidth(196);
const thumbnailHeight = thumbnailWidth * (110 / 196); // 비율 유지

const Container = styled.View({
  width: thumbnailWidth,
  height: thumbnailHeight,
  paddingHorizontal: AppSize.ratioWidth(16),
});
```

## 규칙 3.4: SafeArea 처리

```typescript
const HeaderContainer = styled.View({
  paddingTop: AppSize.statusBarHeight,
});

const FooterContainer = styled.View({
  paddingBottom: AppSize.bottomInset,
});
```

---

# 4. 데이터 페칭 최적화

**영향도: HIGH**

## 규칙 4.1: SWR/React Query로 캐싱 및 중복 제거

❌ 잘못된 방식:
```typescript
function useContentData(id: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent(id).then(setData).finally(() => setLoading(false));
  }, [id]);

  return { data, loading };
}
```

✅ 올바른 방식:
```typescript
import useSWR from 'swr';

function useContentData(id: string) {
  const { data, error, isLoading } = useSWR(
    `/content/${id}`,
    () => fetchContent(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1분간 중복 요청 방지
    }
  );

  return { data, error, isLoading };
}
```

## 규칙 4.2: 조건부 데이터 페칭

```typescript
// 필요할 때만 페칭
const { data } = useSWR(
  shouldFetch ? `/content/${id}` : null,
  fetcher
);
```

## 규칙 4.3: 페이지네이션/무한 스크롤

```typescript
import useSWRInfinite from 'swr/infinite';

function useInfiniteVideos(channelId: string) {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.hasMore) return null;
    return `/videos?channel=${channelId}&page=${pageIndex}`;
  };

  return useSWRInfinite(getKey, fetcher);
}
```

---

# 5. 리렌더 최적화

**영향도: MEDIUM**

## 규칙 5.1: 메모이제이션 적절히 사용

메모이제이션은 오버헤드가 있습니다. 복잡한 계산이나 자주 변하는 의존성에만 사용하세요.

❌ 불필요한 메모이제이션:
```typescript
// 단순한 계산에 useMemo 사용 - 오버헤드 > 이익
const releaseYear = useMemo(() =>
  data?.releaseDate ? formatter.dateToYear(data.releaseDate) : '',
  [data?.releaseDate]
);
```

✅ 올바른 방식:
```typescript
// 단순 계산은 일반 변수로
const releaseYear = data?.releaseDate
  ? formatter.dateToYear(data.releaseDate)
  : '';

// 복잡한 계산에만 useMemo
const processedData = useMemo(() =>
  data.map(item => ({
    ...item,
    computed: expensiveCalculation(item),
    formatted: complexFormatting(item),
  })),
  [data]
);
```

## 규칙 5.2: useCallback은 자식에 전달할 때만

❌ 불필요한 useCallback:
```typescript
function Component() {
  // 자식에 전달하지 않으면 불필요
  const handlePress = useCallback(() => {
    console.log('pressed');
  }, []);

  return <Button onPress={handlePress} />;
}
```

✅ 필요한 경우:
```typescript
function ParentComponent() {
  // React.memo된 자식에 전달할 때 유용
  const handleItemPress = useCallback((id: string) => {
    navigation.navigate('Detail', { id });
  }, [navigation]);

  return <MemoizedList onItemPress={handleItemPress} />;
}
```

## 규칙 5.3: 상태 분리로 리렌더 범위 최소화

❌ 잘못된 방식:
```typescript
function Form() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // 어떤 필드가 바뀌어도 전체 리렌더
  return (
    <>
      <Input value={formState.name} onChange={...} />
      <Input value={formState.email} onChange={...} />
    </>
  );
}
```

✅ 올바른 방식:
```typescript
function Form() {
  // 필드별 분리 또는 커스텀 훅으로 관리
  const { formData, updateField } = useFormState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  return (
    <>
      <NameInput value={formData.name} onUpdate={updateField} />
      <EmailInput value={formData.email} onUpdate={updateField} />
    </>
  );
}
```

---

# 6. 렌더링 성능

**영향도: MEDIUM**

## 규칙 6.1: FlatList 최적화 필수

❌ 잘못된 방식:
```typescript
<FlatList
  data={data}
  renderItem={({ item }) => <ComplexItem item={item} />}
/>
```

✅ 올바른 방식:
```typescript
const MemoizedItem = React.memo(ComplexItem);

<FlatList
  data={data}
  renderItem={({ item }) => <MemoizedItem item={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

## 규칙 6.2: 이미지 최적화

```typescript
// LoadableImageView 컴포넌트 사용
<LoadableImageView
  source={thumbnailUrl}
  width={thumbnailWidth}
  height={thumbnailHeight}
  borderRadius={4}
/>

// 또는 FastImage 사용
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: imageUrl, priority: FastImage.priority.normal }}
  style={{ width: 200, height: 200 }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

## 규칙 6.3: 애니메이션에 useNativeDriver 필수

❌ 잘못된 방식:
```typescript
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  // useNativeDriver 누락!
}).start();
```

✅ 올바른 방식:
```typescript
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // 필수!
}).start();
```

---

# 7. 플랫폼별 처리

**영향도: MEDIUM**

## 규칙 7.1: Platform.select로 스타일 분기

```typescript
import { Platform } from 'react-native';

const Container = styled.View({
  ...Platform.select({
    ios: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
});
```

## 규칙 7.2: 플랫폼별 컴포넌트 분리

```typescript
// DatePicker.ios.tsx
export function DatePicker() {
  return <IOSDatePicker />;
}

// DatePicker.android.tsx
export function DatePicker() {
  return <AndroidDatePicker />;
}

// 사용처
import { DatePicker } from './DatePicker';
```

## 규칙 7.3: 일관된 리턴 타입 유지

❌ 잘못된 방식:
```typescript
const getDeviceInfo = () => {
  if (Platform.OS === 'ios') {
    return { id: Device.uniqueId, os: 'iOS' };
  }
  return Device.androidId; // 다른 타입!
};
```

✅ 올바른 방식:
```typescript
const getDeviceInfo = (): DeviceInfo => ({
  id: Platform.OS === 'ios' ? Device.uniqueId : Device.androidId,
  os: Platform.OS,
});
```

---

# 8. 코드 품질 원칙

**영향도: LOW-MEDIUM**

## 규칙 8.1: 복잡한 조건은 변수로 추출

❌ 잘못된 방식:
```typescript
{Platform.OS === 'ios' && !isTablet && orientation === 'portrait' ?
  <SafeAreaView><Header /></SafeAreaView> : <Header />}
```

✅ 올바른 방식:
```typescript
const shouldUseSafeArea = Platform.OS === 'ios' && !isTablet && orientation === 'portrait';

{shouldUseSafeArea ? (
  <SafeAreaView><Header /></SafeAreaView>
) : (
  <Header />
)}
```

## 규칙 8.2: 매직 넘버 제거

❌ 잘못된 방식:
```typescript
const Container = styled.View({
  padding: 16,
  marginTop: 24,
  borderRadius: 8,
});
```

✅ 올바른 방식:
```typescript
const SPACING = {
  sm: 8,
  md: 16,
  lg: 24,
} as const;

const RADIUS = {
  sm: 4,
  md: 8,
  lg: 16,
} as const;

const Container = styled.View({
  padding: SPACING.md,
  marginTop: SPACING.lg,
  borderRadius: RADIUS.md,
});
```

## 규칙 8.3: Props Drilling 제거

❌ 잘못된 방식:
```typescript
<ContentDetailPage userData={userData}>
  <Header userData={userData}>
    <UserProfile userData={userData} />
  </Header>
</ContentDetailPage>
```

✅ 올바른 방식:
```typescript
const UserContext = createContext<UserData | null>(null);

function ContentDetailPage() {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Header>
        <UserProfile /> {/* useContext로 접근 */}
      </Header>
    </UserContext.Provider>
  );
}
```

---

# 체크리스트

## 코드 작성 전
- [ ] 비동기 요청을 병렬화할 수 있는가?
- [ ] 기존 스타일 시스템(textStyles, colors)을 사용하는가?
- [ ] 반응형 크기에 AppSize를 사용하는가?

## 코드 작성 중
- [ ] StyleSheet 대신 Emotion Native 사용
- [ ] 직접적인 색상/폰트 값 없이 시스템 사용
- [ ] useNativeDriver: true 설정
- [ ] FlatList 최적화 옵션 적용
- [ ] SVG 아이콘 크기 명시

## 코드 리뷰 시
- [ ] 불필요한 리렌더 없는가?
- [ ] 메모이제이션이 적절히 사용되었는가?
- [ ] 플랫폼별 차이가 고려되었는가?
- [ ] 번들 크기에 영향을 주는 임포트가 있는가?

---

## 참고 리소스

- 프로젝트 스타일 가이드: `/CLAUDE.md`
- 색상 시스템: `@/shared/styles/colors`
- 텍스트 스타일: `@/shared/styles/textStyles`
- 반응형 유틸: `@/shared/utils/appSize`
- 공통 컴포넌트: `src/presentation/components/`
