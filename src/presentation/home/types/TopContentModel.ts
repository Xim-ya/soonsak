import { BaseContentModel } from "../../../shared/types/content/baseContentModel";
import { ContentType } from "../../../shared/types/content/contentType.enum";

interface TopContentModel extends BaseContentModel {
    pointDescription: string,
    keywords: string[],
    backdropImgUrl: string,
}

export default TopContentModel;



