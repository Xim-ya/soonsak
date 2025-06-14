import { BaseContentModel } from "../../../shared/types/content/baseContentModel";

interface TopContentModel extends BaseContentModel {
    pointDescription: string,
    keywords: string[],
    backdropImgUrl: string,
}

export default TopContentModel;



