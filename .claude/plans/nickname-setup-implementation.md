# 프로필 설정 페이지 구현 계획

## 개요

프로필(닉네임, 프로필 이미지)을 설정하는 페이지를 구현합니다.
**초기 설정**과 **수정** 두 가지 모드로 재사용됩니다.

### 사용 시나리오

| 모드 | 진입 경로 | 특징 |
|------|----------|------|
| **초기 설정** | 회원가입 직후 | 뒤로가기 차단, 완료 시 취향선택으로 이동 |
| **수정** | 마이페이지 → 프로필 수정 | 뒤로가기 허용, 완료 시 이전 화면으로 |

### 플로우 (초기 설정)
```
회원가입 완료 (소셜 로그인)
    ↓
ProfileSetupPage (프로필 설정) - mode: 'initial'
    ↓
ContentPreferencesPage (취향 선택) - 스킵 가능
    ↓
MainTabs (홈)
```

### 플로우 (수정)
```
마이페이지
    ↓
ProfileSetupPage (프로필 수정) - mode: 'edit'
    ↓
마이페이지 (goBack)
```

### 핵심 요구사항
1. **초기값**: Auth Provider(Google/Apple/Kakao)에서 가져온 이름과 프로필 이미지를 기본값으로 설정
2. **폴백**: Provider에서 이름을 가져오지 못한 경우 랜덤 닉네임 생성
3. **Validation**: 2-10자, 공백 불가, 한글/영문/숫자/`_`/`-`만 허용, 비속어 필터링, 중복 체크
4. **모드 분기**: 초기 설정 vs 수정 모드에 따른 UI/로직 분기

---

## 1. 데이터 흐름

### 1-1. 초기값 설정 로직

```typescript
// Auth Provider에서 가져오는 정보 (Supabase user_metadata)
const metadata = user.user_metadata;
const providerName = metadata?.name || metadata?.full_name;
const providerAvatar = metadata?.avatar_url || metadata?.picture;

// displayName 결정 우선순위
1. Provider name (Google: displayName, Apple: familyName+givenName, Kakao: nickname)
2. Email prefix (user@example.com → "user")
3. 랜덤 닉네임 생성 ("활발한고양이123")
```

### 1-2. 저장 시점

| 시점 | 저장 데이터 |
|------|------------|
| 회원가입 직후 | profiles 테이블에 Provider 정보로 초기 레코드 생성 (Supabase Trigger) |
| 닉네임 설정 완료 | display_name 업데이트 |

---

## 2. 파일 구조

### 신규 생성

```
src/
├── features/user/
│   ├── api/
│   │   └── userApi.ts                    # 프로필 API
│   ├── constants/
│   │   ├── nicknameValidation.ts         # Validation 규칙 & 정규식
│   │   └── randomNickname.ts             # 랜덤 닉네임 생성기
│   ├── hooks/
│   │   └── useNicknameValidation.ts      # Validation 훅
│   └── types/
│       └── index.ts                      # 타입 정의
│
├── presentation/pages/
│   └── profile-setup/
│       ├── ProfileSetupPage.tsx          # 메인 페이지
│       ├── _components/
│       │   ├── NicknameInput.tsx         # 닉네임 입력 필드
│       │   └── ProfileImagePicker.tsx    # 프로필 이미지 선택/미리보기
│       └── _hooks/
│           └── useProfileSetup.ts        # 페이지 비즈니스 로직
│
├── shared/navigation/
│   ├── constant/routePages.ts            # 라우트 추가
│   └── types.ts                          # 네비게이션 타입 추가
```

### 수정

| 파일 | 수정 내용 |
|------|----------|
| `StackNavigator.tsx` | ProfileSetupPage 라우트 추가 |
| `AuthProvider.tsx` | 신규 가입 여부 판단 로직 추가 |

---

## 3. 핵심 구현 상세

### 3-1. Validation 규칙 (`nicknameValidation.ts`)

```typescript
/** 닉네임 Validation 규칙 (Flutter Regex.dart 기반) */
export const NICKNAME_RULES = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 10,
  // 한글, 영문, 숫자, _, - 만 허용
  VALID_PATTERN: /^[a-zA-Z0-9ㄱ-ㅎ가-힣_-]+$/,
  // 공백 포함 여부
  SPACE_PATTERN: /\s/,
  // 예약어
  RESERVED_WORDS: ['운영자', '관리자', 'admin', 'plotz', '순삭', 'soonsak'],
} as const;

/** 비속어 정규식 (Flutter 기반) */
export const PROFANITY_PATTERN = /시발|병신|...(생략).../;

/** Validation 에러 메시지 */
export const NICKNAME_ERRORS = {
  EMPTY: '닉네임을 입력해주세요',
  TOO_SHORT: '닉네임은 2자 이상이어야 합니다',
  TOO_LONG: '닉네임은 10자 이하여야 합니다',
  HAS_SPACE: '닉네임에는 공백을 사용할 수 없습니다',
  INVALID_CHAR: '한글, 영문, 숫자, _, -만 사용할 수 있습니다',
  PROFANITY: '사용할 수 없는 단어가 포함되어 있습니다',
  RESERVED: '사용할 수 없는 닉네임입니다',
  DUPLICATE: '이미 사용 중인 닉네임입니다',
} as const;
```

### 3-2. 랜덤 닉네임 생성 (`randomNickname.ts`)

```typescript
/** 형용사 목록 */
const ADJECTIVES = [
  '활발한', '신나는', '귀여운', '멋진', '빛나는',
  '용감한', '따뜻한', '똑똑한', '재미있는', '행복한',
  '씩씩한', '사랑스런', '당당한', '유쾌한', '상큼한',
];

/** 명사 목록 (동물/캐릭터) */
const NOUNS = [
  '고양이', '강아지', '토끼', '여우', '판다',
  '다람쥐', '햄스터', '펭귄', '부엉이', '돌고래',
  '코알라', '수달', '사자', '호랑이', '곰',
];

/**
 * 랜덤 닉네임 생성
 * @returns "형용사명사123" 형태 (예: "활발한고양이42")
 */
export function generateRandomNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${noun}${num}`;
}
```

### 3-3. User API (`userApi.ts`)

```typescript
export const userApi = {
  /**
   * 닉네임 중복 체크
   */
  checkNicknameDuplicate: async (nickname: string): Promise<boolean> => {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('display_name', nickname)
      .maybeSingle();

    if (error) throw error;
    return data !== null; // true = 중복
  },

  /**
   * 프로필 이미지 업로드
   * Supabase Storage에 업로드 후 public URL 반환
   */
  uploadProfileImage: async (userId: string, imageUri: string): Promise<string> => {
    const fileName = `${userId}_${Date.now()}.jpg`;
    const filePath = `avatars/${fileName}`;

    // 이미지 파일 읽기
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Supabase Storage에 업로드
    const { error: uploadError } = await supabaseClient.storage
      .from('profiles')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Public URL 생성
    const { data } = supabaseClient.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * 프로필 업데이트
   */
  updateProfile: async (
    userId: string,
    updates: { displayName?: string; avatarUrl?: string },
  ): Promise<void> => {
    const { error } = await supabaseClient
      .from('profiles')
      .update({
        display_name: updates.displayName,
        avatar_url: updates.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
  },

  /**
   * 프로필 조회
   */
  getProfile: async (userId: string): Promise<ProfileDto | null> => {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return mapWithField<ProfileDto>(data);
  },

  /**
   * 온보딩 완료 여부 확인
   * (display_name이 null이 아니면 완료)
   */
  checkOnboardingComplete: async (userId: string): Promise<boolean> => {
    const { data } = await supabaseClient
      .from('profiles')
      .select('display_name')
      .eq('id', userId)
      .single();

    return data?.display_name !== null;
  },
};
```

### 3-4. Validation 훅 (`useNicknameValidation.ts`)

```typescript
interface UseNicknameValidationReturn {
  error: string | null;
  isValid: boolean;
  validate: (value: string) => string | null;
  validateAsync: (value: string) => Promise<string | null>; // 중복 체크 포함
}

export function useNicknameValidation(): UseNicknameValidationReturn {
  const [error, setError] = useState<string | null>(null);

  /** 동기 Validation (입력 중 실시간 체크) */
  const validate = useCallback((value: string): string | null => {
    if (!value) return NICKNAME_ERRORS.EMPTY;
    if (NICKNAME_RULES.SPACE_PATTERN.test(value)) return NICKNAME_ERRORS.HAS_SPACE;
    if (value.length < NICKNAME_RULES.MIN_LENGTH) return NICKNAME_ERRORS.TOO_SHORT;
    if (value.length > NICKNAME_RULES.MAX_LENGTH) return NICKNAME_ERRORS.TOO_LONG;
    if (!NICKNAME_RULES.VALID_PATTERN.test(value)) return NICKNAME_ERRORS.INVALID_CHAR;
    if (PROFANITY_PATTERN.test(value)) return NICKNAME_ERRORS.PROFANITY;
    if (NICKNAME_RULES.RESERVED_WORDS.some(w =>
      value.toLowerCase().includes(w.toLowerCase())
    )) return NICKNAME_ERRORS.RESERVED;
    return null;
  }, []);

  /** 비동기 Validation (저장 시 중복 체크 포함) */
  const validateAsync = useCallback(async (value: string): Promise<string | null> => {
    const syncError = validate(value);
    if (syncError) return syncError;

    const isDuplicate = await userApi.checkNicknameDuplicate(value);
    if (isDuplicate) return NICKNAME_ERRORS.DUPLICATE;

    return null;
  }, [validate]);

  return {
    error,
    isValid: error === null,
    validate,
    validateAsync,
  };
}
```

### 3-5. 페이지 훅 (`useProfileSetup.ts`)

```typescript
/** 페이지 모드 */
type ProfileSetupMode = 'initial' | 'edit';

interface UseProfileSetupParams {
  mode: ProfileSetupMode;
}

interface UseProfileSetupReturn {
  nickname: string;
  setNickname: (value: string) => void;
  avatarUrl: string | undefined;
  pickedImageUri: string | undefined;   // 새로 선택한 이미지
  error: string | null;
  isLoading: boolean;
  isValid: boolean;
  isChanged: boolean;                    // 변경 사항 있는지 (수정 모드용)
  handlePickImage: () => Promise<void>;
  handleSubmit: () => Promise<void>;
}

export function useProfileSetup({ mode }: UseProfileSetupParams): UseProfileSetupReturn {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { validate, validateAsync } = useNicknameValidation();

  // 초기값 결정
  const initialNickname = useMemo(() => {
    if (mode === 'edit') {
      // 수정 모드: 기존 닉네임 사용
      return user?.user_metadata?.display_name ?? '';
    }
    // 초기 설정 모드: Provider name > email prefix > 랜덤
    const metadata = user?.user_metadata;
    const providerName = metadata?.name || metadata?.full_name;
    if (providerName) return providerName;
    if (user?.email) return user.email.split('@')[0];
    return generateRandomNickname();
  }, [user, mode]);

  const initialAvatarUrl = user?.user_metadata?.avatar_url;

  const [nickname, setNickname] = useState(initialNickname);
  const [pickedImageUri, setPickedImageUri] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 현재 표시할 이미지 (새로 선택한 이미지 > 기존 이미지)
  const avatarUrl = pickedImageUri ?? initialAvatarUrl;

  // 변경 사항 여부 (수정 모드에서 저장 버튼 활성화 조건)
  const isChanged = nickname !== initialNickname || pickedImageUri !== undefined;

  // 입력 변경 시 실시간 Validation
  const handleChange = useCallback((value: string) => {
    setNickname(value);
    setError(validate(value));
  }, [validate]);

  // 이미지 선택
  const handlePickImage = useCallback(async () => {
    // expo-image-picker 사용
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPickedImageUri(result.assets[0].uri);
    }
  }, []);

  // 저장
  const handleSubmit = useCallback(async () => {
    if (!user) return;

    // 수정 모드에서 변경 사항 없으면 그냥 뒤로가기
    if (mode === 'edit' && !isChanged) {
      navigation.goBack();
      return;
    }

    setIsLoading(true);
    try {
      // 비동기 Validation (중복 체크 포함, 닉네임 변경 시에만)
      if (nickname !== initialNickname) {
        const validationError = await validateAsync(nickname);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      // 이미지 업로드 (새로 선택한 경우)
      let uploadedAvatarUrl = initialAvatarUrl;
      if (pickedImageUri) {
        uploadedAvatarUrl = await userApi.uploadProfileImage(user.id, pickedImageUri);
      }

      // 프로필 업데이트
      await userApi.updateProfile(user.id, {
        displayName: nickname,
        avatarUrl: uploadedAvatarUrl,
      });

      // 모드에 따라 다른 네비게이션
      if (mode === 'initial') {
        navigation.navigate(routePages.contentPreferences);
      } else {
        navigation.goBack();
      }
    } catch (e) {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [user, nickname, pickedImageUri, mode, isChanged, initialNickname, initialAvatarUrl, validateAsync, navigation]);

  return {
    nickname,
    setNickname: handleChange,
    avatarUrl,
    pickedImageUri,
    error,
    isLoading,
    isValid: error === null && nickname.length > 0,
    isChanged,
    handlePickImage,
    handleSubmit,
  };
}
```

---

## 4. UI 컴포넌트

### 4-1. ProfileSetupPage 레이아웃

```
┌─────────────────────────────────────┐
│  [←]              프로필 설정    [저장] │  ← AppBar (수정 모드만 뒤로가기)
├─────────────────────────────────────┤
│                                     │
│         [프로필 이미지]              │
│            (84x84)                  │
│            [변경]                   │  ← 이미지 터치 시 갤러리 열기
│                                     │
│  ┌─────────────────────────────┐   │
│  │  활발한고양이42              │   │  ← 입력 필드 (초기값 표시)
│  └─────────────────────────────┘   │
│  2~10자, 한글/영문/숫자/_/- 가능     │  ← 안내 문구 or 에러 메시지
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │     시작하기 / 저장하기       │   │  ← 모드에 따라 텍스트 변경
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 4-2. 모드별 UI 분기

| 요소 | 초기 설정 (initial) | 수정 (edit) |
|------|-------------------|-------------|
| AppBar 뒤로가기 | 숨김 | 표시 |
| 타이틀 | "프로필 설정" | "프로필 수정" |
| 버튼 텍스트 | "시작하기" | "저장" |
| 버튼 활성 조건 | isValid | isValid && isChanged |
| 완료 후 동작 | 취향선택으로 이동 | goBack |

### 4-3. 스타일 가이드

- 프로필 이미지: 84x84, 원형, `RoundedAvatarView` 사용
- 이미지 오버레이: 하단에 "변경" 텍스트 (반투명 배경)
- 입력 필드: `colors.gray05` 배경, `colors.gray03` 테두리
- 에러 상태: `colors.red` 테두리, 에러 메시지 표시
- 버튼: `colors.main` 배경, 비활성 시 `colors.gray04`

---

## 5. 네비게이션 연동

### 5-1. 라우트 파라미터

```typescript
// types.ts
export type RootStackParamList = {
  // ...
  ProfileSetup: { mode: 'initial' | 'edit' };
};
```

### 5-2. 신규 가입 판단 로직

```typescript
// AuthProvider.tsx 또는 별도 훅에서
const checkNewUser = async (userId: string) => {
  const profile = await userApi.getProfile(userId);

  // display_name이 null이면 신규 가입자 → 프로필 설정으로 이동
  if (profile?.displayName === null) {
    navigation.reset({
      routes: [{ name: routePages.profileSetup, params: { mode: 'initial' } }],
    });
  }
};
```

### 5-3. 마이페이지에서 수정 진입

```typescript
// MyPage.tsx
const handleEditProfile = () => {
  navigation.navigate(routePages.profileSetup, { mode: 'edit' });
};
```

### 5-4. StackNavigator 수정

```typescript
<Stack.Screen
  name={routePages.profileSetup}
  component={ProfileSetupPage}
  options={({ route }) => ({
    headerShown: false,
    // 초기 설정 모드에서만 뒤로가기 제스처 비활성화
    gestureEnabled: route.params?.mode !== 'initial',
  })}
/>
```

---

## 6. 구현 순서

| 순서 | 작업 |
|------|------|
| 1 | `features/user/` 구조 생성 |
| 2 | `nicknameValidation.ts` 구현 |
| 3 | `randomNickname.ts` 구현 |
| 4 | `userApi.ts` 구현 (중복체크, 프로필 업데이트, 이미지 업로드) |
| 5 | `useNicknameValidation.ts` 훅 구현 |
| 6 | `useProfileSetup.ts` 훅 구현 (mode 분기 포함) |
| 7 | `NicknameInput.tsx` 컴포넌트 구현 |
| 8 | `ProfileImagePicker.tsx` 컴포넌트 구현 |
| 9 | `ProfileSetupPage.tsx` 페이지 구현 |
| 10 | 네비게이션 연동 (라우트, 파라미터, 신규가입 분기) |
| 11 | 린트 및 테스트 |

---

## 7. 체크리스트

### 공통
- [ ] Provider에서 이름/이미지 정상 가져오기
- [ ] 랜덤 닉네임 생성 동작
- [ ] 실시간 Validation 동작
- [ ] 중복 체크 API 동작
- [ ] 프로필 이미지 선택 및 업로드
- [ ] 키보드 자동 포커스
- [ ] 로딩 상태 표시
- [ ] 에러 상태 표시

### 초기 설정 모드 (initial)
- [ ] 뒤로가기 제스처 차단
- [ ] 완료 시 취향선택 화면으로 이동
- [ ] 버튼 텍스트 "시작하기"

### 수정 모드 (edit)
- [ ] 뒤로가기 허용
- [ ] 기존 닉네임/이미지 표시
- [ ] 변경 없으면 저장 버튼 비활성화
- [ ] 완료 시 이전 화면으로 복귀
- [ ] 버튼 텍스트 "저장"
