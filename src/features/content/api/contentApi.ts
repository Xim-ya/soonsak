import { ContentSectionListModel } from '@/presentation/home/types/contentSectionListModel';
import { apiClient } from '@/shared/clients/apiClient';
import { BaseContentModel } from '@/shared/types/content/baseContentModel';
import { convertWithCustomMapping } from '@/shared/utils/caseConverter';
import { ContentDto } from '../types';

export const contentApi = {
    /**
     * 최근 업로드된 콘텐츠 조회
     */
    getRecentUploadedContents: async (): Promise<ContentDto[]> => {
        const { data, error } = await apiClient.content
            .from('contents')
            .select('*')
            .order('uploaded_at', { ascending: false });

        if (error) {
            console.error('콘텐츠 조회 실패:', error);
            throw new Error(`Failed to fetch contents: ${error.message}`);
        }

        console.log('정보', data);

        const mappedData: ContentDto[] = convertWithCustomMapping<ContentDto[]>(data ?? []);

        return mappedData ?? [];
    }
};