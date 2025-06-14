import { ContentType } from "./contentType.enum";

export interface BaseContentModel {
    readonly id: string,
    readonly title: string;
    readonly type: ContentType
}