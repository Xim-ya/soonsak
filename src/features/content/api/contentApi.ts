import { apiClient } from '@/features/utils/clients/apiClient';
import { mapWithField } from '@/features/utils/mapper/fieldMapper';
import { ContentDto } from '../types';
import { CONTENT_DATABASE } from '../../utils/constants/dbName';

export const contentApi = {
  /**
   * 최근 업로드된 콘텐츠 조회
   */
  getRecentUploadedContents: async (): Promise<ContentDto[]> => {
    const { data, error } = await apiClient.content
      .from(CONTENT_DATABASE.TABLES.CONTENTS)
      .select('*')
      .order(CONTENT_DATABASE.COLUMNS.UPDATED_AT, { ascending: false });

    if (error) {
      console.error('콘텐츠 조회 실패:', error);
      throw new Error(`Failed to fetch contents: ${error.message}`);
    }

    const contents: ContentDto[] = mapWithField<ContentDto[]>(data ?? []);

    return contents ?? [];
  },
};
