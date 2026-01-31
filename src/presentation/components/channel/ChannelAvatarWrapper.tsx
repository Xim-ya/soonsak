/**
 * ChannelAvatarWrapper - 채널 아바타 선택 상태 래퍼
 *
 * 채널 로고 아바타에 선택/미선택 상태를 표시합니다.
 * 선택 시 녹색 테두리, 미선택 시 반투명 처리합니다.
 * ChannelFilterTab, ChannelSelectionPage에서 공통으로 사용됩니다.
 *
 * @example
 * <ChannelAvatarWrapper isSelected={true} avatarSize={72}>
 *   <RoundedAvatorView source={logoUrl} size={72} />
 * </ChannelAvatarWrapper>
 */

import styled from '@emotion/native';
import colors from '@/shared/styles/colors';

interface ChannelAvatarWrapperProps {
  isSelected: boolean;
  avatarSize: number;
  unselectedOpacity?: number;
}

const ChannelAvatarWrapper = styled.View<ChannelAvatarWrapperProps>(
  ({ isSelected, avatarSize, unselectedOpacity = 0.6 }) => ({
    borderRadius: avatarSize / 2 + 3,
    borderWidth: 2.5,
    borderColor: isSelected ? colors.green : 'transparent',
    padding: 1,
    opacity: isSelected ? 1 : unselectedOpacity,
  }),
);

export { ChannelAvatarWrapper };
export type { ChannelAvatarWrapperProps };
