/**
 * useChannelSelection - 채널 선택 상태 관리 훅
 *
 * 전체 채널 목록을 조회하고, 선택/해제/초기화 기능을 제공합니다.
 * ChannelFilterTab과 동일한 queryKey를 사용하여 캐시를 공유합니다.
 */

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { channelApi } from '@/features/channel/api/channelApi';
import type { ChannelDto } from '@/features/channel/types';

interface UseChannelSelectionReturn {
  /** 전체 채널 목록 */
  readonly channels: ChannelDto[];
  /** 로딩 상태 */
  readonly isLoading: boolean;
  /** 현재 선택된 채널 ID 목록 */
  readonly selectedIds: string[];
  /** 채널 선택/해제 토글 */
  readonly toggleChannel: (channelId: string) => void;
  /** 선택 초기화 */
  readonly resetSelection: () => void;
}

function useChannelSelection(initialSelectedIds: string[]): UseChannelSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  const { data: channels = [], isLoading } = useQuery({
    queryKey: ['activeChannels'],
    queryFn: () => channelApi.getActiveChannels(),
    staleTime: 5 * 60 * 1000,
  });

  const toggleChannel = useCallback((channelId: string) => {
    setSelectedIds((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId],
    );
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return { channels, isLoading, selectedIds, toggleChannel, resetSelection };
}

export { useChannelSelection };
