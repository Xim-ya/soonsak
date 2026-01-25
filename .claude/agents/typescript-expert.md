---
name: typescript-expert
description: TypeScript 타입 시스템 전문가. 타입 안전성, 제네릭, 유틸리티 타입, 타입 추론 최적화를 담당합니다.
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

# TypeScript Best Practices

> TypeScript 타입 시스템 가이드 - 7개 카테고리, 40+ 규칙, 타입 안전성 극대화

## 적용 시나리오

다음 상황에서 이 가이드를 참조하세요:
- 새로운 타입/인터페이스 정의
- 제네릭 함수/컴포넌트 작성
- API 응답 타입 정의
- 타입 오류 해결
- 기존 코드 타입 개선

---

# 1. 타입 정의 기본 원칙

**영향도: CRITICAL**

## 규칙 1.1: any 사용 금지

❌ 잘못된 방식:
```typescript
function processData(data: any) {
  return data.items.map((item: any) => item.name);
}
```

✅ 올바른 방식:
```typescript
interface DataItem {
  name: string;
  id: number;
}

interface Data {
  items: DataItem[];
}

function processData(data: Data): string[] {
  return data.items.map(item => item.name);
}
```

## 규칙 1.2: unknown은 타입 가드와 함께

```typescript
function handleApiResponse(response: unknown): User {
  // 타입 가드로 안전하게 처리
  if (!isUser(response)) {
    throw new Error('Invalid user response');
  }
  return response;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}
```

## 규칙 1.3: interface vs type 구분

```typescript
// interface: 객체 구조 정의, 확장 가능
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}

// type: 유니온, 교차, 유틸리티 타입
type Status = 'idle' | 'loading' | 'success' | 'error';
type UserWithStatus = User & { status: Status };
type ReadonlyUser = Readonly<User>;
```

## 규칙 1.4: 명시적 반환 타입 선언

❌ 잘못된 방식:
```typescript
// 반환 타입 추론에 의존 - 의도치 않은 타입 변경 가능
function fetchUser(id: string) {
  return api.get(`/users/${id}`);
}
```

✅ 올바른 방식:
```typescript
// 명시적 반환 타입으로 계약 명확화
function fetchUser(id: string): Promise<User> {
  return api.get(`/users/${id}`);
}
```

---

# 2. 제네릭 활용

**영향도: HIGH**

## 규칙 2.1: 의미 있는 제네릭 이름

❌ 잘못된 방식:
```typescript
function transform<T, U, V>(data: T, fn: (x: U) => V): V {
  // T, U, V가 무엇인지 불명확
}
```

✅ 올바른 방식:
```typescript
function transform<TInput, TOutput>(
  data: TInput,
  fn: (input: TInput) => TOutput
): TOutput {
  return fn(data);
}
```

## 규칙 2.2: 제네릭 제약 조건 활용

```typescript
// 특정 속성을 가진 타입으로 제한
interface HasId {
  id: string;
}

function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// keyof로 속성 접근 제한
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## 규칙 2.3: 조건부 타입 활용

```typescript
// 입력 타입에 따른 반환 타입 분기
type ApiResponse<T> = T extends Array<infer U>
  ? { items: U[]; total: number }
  : { data: T };

// 널러블 타입 처리
type NonNullableProperties<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};
```

## 규칙 2.4: 제네릭 기본값 설정

```typescript
interface PaginatedResponse<T, TMeta = DefaultMeta> {
  data: T[];
  meta: TMeta;
}

interface DefaultMeta {
  page: number;
  total: number;
}

// 기본값 사용
const response: PaginatedResponse<User> = {...};

// 커스텀 메타 사용
const customResponse: PaginatedResponse<User, CustomMeta> = {...};
```

---

# 3. 유틸리티 타입 활용

**영향도: HIGH**

## 규칙 3.1: 내장 유틸리티 타입 우선 사용

```typescript
// Partial - 모든 속성을 선택적으로
type UpdateUserDto = Partial<User>;

// Required - 모든 속성을 필수로
type CompleteUser = Required<User>;

// Pick - 특정 속성만 선택
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - 특정 속성 제외
type UserWithoutPassword = Omit<User, 'password'>;

// Record - 키-값 매핑
type UserRoles = Record<string, Role>;

// Extract/Exclude - 유니온 타입 필터링
type SuccessStatus = Extract<Status, 'success' | 'idle'>;
type ErrorStatus = Exclude<Status, 'success'>;
```

## 규칙 3.2: 커스텀 유틸리티 타입 정의

```typescript
// 깊은 Readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

// 널러블 타입
type Nullable<T> = T | null;

// 선택적 널러블
type OptionalNullable<T> = {
  [K in keyof T]?: T[K] | null;
};

// 특정 키만 필수로
type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
```

---

# 4. API 타입 정의

**영향도: HIGH**

## 규칙 4.1: API 응답 래퍼 타입

```typescript
// 성공/실패를 구분하는 Result 타입
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// API 응답 타입
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// 페이지네이션 응답
interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
```

## 규칙 4.2: DTO 타입 분리

```typescript
// 생성용 DTO
interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

// 수정용 DTO (모두 선택적)
type UpdateUserDto = Partial<Omit<CreateUserDto, 'password'>>;

// 응답 DTO (민감 정보 제외)
type UserResponseDto = Omit<User, 'password' | 'refreshToken'>;
```

## 규칙 4.3: Supabase 타입 활용

```typescript
// 자동 생성된 타입 활용
import { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type Video = Tables['videos']['Row'];
type VideoInsert = Tables['videos']['Insert'];
type VideoUpdate = Tables['videos']['Update'];

// 관계 포함 타입
type VideoWithChannel = Video & {
  channel: Tables['channels']['Row'];
};
```

---

# 5. 컴포넌트 Props 타입

**영향도: MEDIUM**

## 규칙 5.1: Props 인터페이스 명명 규칙

```typescript
// ComponentNameProps 형식
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  // ...
}
```

## 규칙 5.2: children 타입

```typescript
import { ReactNode, PropsWithChildren } from 'react';

// 명시적 children
interface ContainerProps {
  children: ReactNode;
  padding?: number;
}

// PropsWithChildren 활용
type CardProps = PropsWithChildren<{
  title: string;
}>;
```

## 규칙 5.3: 이벤트 핸들러 타입

```typescript
import { TouchableOpacityProps, TextInputProps } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
}

interface CustomInputProps extends Omit<TextInputProps, 'onChange'> {
  label: string;
  error?: string;
  onChange: (value: string) => void; // 간소화된 시그니처
}
```

## 규칙 5.4: 제네릭 컴포넌트

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <>
      {items.map((item, index) => (
        <View key={keyExtractor(item)}>
          {renderItem(item, index)}
        </View>
      ))}
    </>
  );
}

// 사용
<List<User>
  items={users}
  renderItem={user => <UserCard user={user} />}
  keyExtractor={user => user.id}
/>
```

---

# 6. 타입 가드와 좁히기

**영향도: MEDIUM**

## 규칙 6.1: 사용자 정의 타입 가드

```typescript
// is 키워드로 타입 가드 정의
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as User).id === 'string'
  );
}

// 배열 타입 가드
function isUserArray(value: unknown): value is User[] {
  return Array.isArray(value) && value.every(isUser);
}
```

## 규칙 6.2: 판별 유니온 (Discriminated Union)

```typescript
// 공통 속성으로 타입 구분
type LoadingState = { status: 'loading' };
type SuccessState<T> = { status: 'success'; data: T };
type ErrorState = { status: 'error'; error: Error };

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function renderContent<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading':
      return <Loading />;
    case 'success':
      return <Content data={state.data} />; // data 타입 자동 추론
    case 'error':
      return <Error error={state.error} />; // error 타입 자동 추론
  }
}
```

## 규칙 6.3: assertion 함수

```typescript
function assertDefined<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message ?? 'Value is not defined');
  }
}

function processUser(user: User | null) {
  assertDefined(user, 'User must be defined');
  // 이후 user는 User 타입으로 추론
  console.log(user.name);
}
```

---

# 7. 상수와 열거형

**영향도: LOW-MEDIUM**

## 규칙 7.1: as const로 리터럴 타입

```typescript
// as const로 좁은 타입 유지
const ROUTES = {
  HOME: '/home',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

type Route = typeof ROUTES[keyof typeof ROUTES];
// type Route = '/home' | '/profile' | '/settings'
```

## 규칙 7.2: 열거형 대신 유니온 타입

❌ enum 사용 (트리 쉐이킹 불가):
```typescript
enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}
```

✅ 유니온 타입 사용:
```typescript
const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

type Status = typeof STATUS[keyof typeof STATUS];
```

## 규칙 7.3: 타입과 런타임 값 동기화

```typescript
// 타입과 런타임 배열을 동기화
const VIDEO_TYPES = ['movie', 'series', 'documentary'] as const;
type VideoType = typeof VIDEO_TYPES[number];

// 타입 가드에서 활용
function isVideoType(value: string): value is VideoType {
  return VIDEO_TYPES.includes(value as VideoType);
}
```

---

# 체크리스트

## 타입 정의 시
- [ ] any 사용하지 않았는가?
- [ ] 명시적 반환 타입을 선언했는가?
- [ ] 적절한 제네릭 제약을 사용했는가?

## Props 정의 시
- [ ] ComponentNameProps 명명 규칙을 따르는가?
- [ ] 선택적 props에 기본값을 설정했는가?
- [ ] children 타입이 명확한가?

## API 타입 정의 시
- [ ] 응답 타입이 명확히 정의되었는가?
- [ ] DTO 타입이 용도별로 분리되었는가?
- [ ] 에러 케이스가 타입에 포함되었는가?

## 코드 리뷰 시
- [ ] 타입 가드가 적절히 사용되었는가?
- [ ] 유니온 타입이 판별 가능한가?
- [ ] 유틸리티 타입을 활용했는가?

---

## 참고 리소스

- TypeScript 공식 문서: https://www.typescriptlang.org/docs/
- Supabase 타입: `@/types/supabase`
- 프로젝트 공통 타입: `src/features/*/types/`
