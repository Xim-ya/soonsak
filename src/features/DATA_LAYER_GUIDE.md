# 데이터 레이어 아키텍처 가이드

## 개요

```
features/          → DTO (Data Transfer Object)
presentation/      → Model (UI용 도메인 모델)
```

## DTO vs Model

| 구분 | DTO | Model |
|------|-----|-------|
| 위치 | `features/` | `presentation/` |
| 역할 | DB/API 테이블 1:1 매핑 | UI에서 필요한 필드만 선택 |
| 네이밍 | `~Dto` | `~Model` |
| 필드 | 전체 컬럼 포함 | 필요한 필드만 포함 |

## 흐름

```
DB/API → DTO (전체 데이터) → Model (필요한 필드만) → UI
```

## 예시

### 1. DTO 정의 (features/)

```typescript
// features/content/types/index.ts
// DB 테이블의 모든 컬럼과 1:1 매핑
interface ContentDto {
  readonly id: number;
  readonly title: string;
  readonly posterPath: string;
  readonly contentType: ContentType;
  readonly uploadedAt: ISOTimestamp;
  readonly releaseDate?: string;
  readonly genreIds?: number[];
}
```

### 2. API 레이어 (features/)

```typescript
// features/content/api/contentApi.ts
// DTO를 반환
getContents: async (): Promise<ContentDto[]> => {
  const { data } = await supabaseClient.from('contents').select('*');
  return mapWithField<ContentDto[]>(data ?? []);
}
```

### 3. Model 정의 (presentation/)

```typescript
// presentation/pages/xxx/_types/someModel.cd.ts
// DTO에서 필요한 필드만 선택

export interface SomeModel {
  readonly id: number;
  readonly title: string;
  // UI에 필요한 필드만 정의
}

export namespace SomeModel {
  export function fromDto(dto: ContentDto): SomeModel {
    return {
      id: dto.id,
      title: dto.title,
    };
  }

  export function fromDtoList(dtoList: ContentDto[]): SomeModel[] {
    return dtoList.map(fromDto);
  }
}
```

### 4. Hook에서 변환 (presentation/)

```typescript
// presentation/pages/xxx/_hooks/useSomeData.ts
const { data } = useQuery({
  queryFn: async () => {
    const dtos = await contentApi.getContents();
    return SomeModel.fromDtoList(dtos); // DTO → Model 변환
  },
});
```

## 파일 네이밍 규칙

- DTO: `features/[도메인]/types/index.ts`
- Model: `presentation/pages/[페이지]/_types/[모델명]Model.cd.ts`

## 체크리스트

- [ ] DTO는 DB/API 테이블의 모든 컬럼을 포함하는가?
- [ ] Model은 UI에 필요한 필드만 포함하는가?
- [ ] `fromDto()` 함수로 DTO → Model 변환을 수행하는가?
- [ ] API 레이어는 DTO를 반환하는가?
