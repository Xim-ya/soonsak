import { BaseContentModel } from "@/shared/types/content/baseContentModel";

/**
 * 포스토 콘텐츠 
 */
export default interface PosterContentModel extends BaseContentModel {
    readonly posterImg: string,
}