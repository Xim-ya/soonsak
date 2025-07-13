import { BaseContentModel } from "@/shared/types/content/baseContentModel";
import { ContentType } from "@/shared/types/content/contentType.enum";
import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";



/** 
 * 'content' 테이블 컬럼과 1대1 대응이 되는 데이터 클래스
 */
interface ContentDto {
    readonly id: number;
    readonly content_type: ContentType;
    readonly title: string;
    readonly poster_path: string;
    readonly uploaded_at: Timestamp;
    readonly updated_at: Timestamp;
}

export { ContentDto }