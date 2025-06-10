import { ContentType } from "./contentType.enum";

export interface BaseContentModel {
    id: string,
    title: string;
    type: ContentType
}