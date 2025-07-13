import { ContentType } from "./contentType.enum";

export interface BaseContentModel {
    readonly id: string,
    readonly title: string;
    readonly type: ContentType
    readonly posterPath: string;
}

/**
 * BaseContentModel 팩토리 메소드
 */
export namespace BaseContentModel {
    /**
     * ContentDto를 BaseContentModel로 변환
     */
    export function fromContentDto(dto: any): BaseContentModel {
        return {
            id: String(dto.id), // number → string 변환
            title: dto.title,
            type: dto.contentType || dto.content_type, // 자동 변환된 필드명 또는 원본
            posterPath: dto.posterPath || dto.poster_path, // 자동 변환된 필드명 또는 원본
        };
    }

    /**
     * ContentDto 배열을 BaseContentModel 배열로 변환
     */
    export function fromContentDtoArray(dtos: any[]): BaseContentModel[] {
        return dtos.map(dto => fromContentDto(dto));
    }
}