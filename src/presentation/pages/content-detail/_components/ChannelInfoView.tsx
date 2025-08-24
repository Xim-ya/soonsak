import { RoundedAvatorView } from '@/presentation/components/image/RoundedAvatarView';
import Gap from '@/presentation/components/view/Gap';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import styled from '@emotion/native';
import RightArrowIcon from '@assets/icons/right_arrrow.svg';
import { Pressable } from 'react-native';
import ChannelModel from '../_types/channelModel.cd';
import { useQuery } from '@tanstack/react-query';
import { formatter } from '@/shared/utils/formatter';
import { SkeletonView } from '@/presentation/components/loading/SkeletonView';
import { useYouTubeChannel } from '@/features/youtube';

/**
 *  채널 정보를 보여주는 뷰
 */
function ChannelInfoView() {
  const channelId = '@어퍼컷';
  const { data: channel, isLoading, error } = useYouTubeChannel(channelId);

  function handlePress() {
    if (isLoading || error) return;

    console.log('handlePress');
  }

  // 에러 시 빈 컴포넌트 반환 (섹션 제목도 숨김)
  if (error) {
    return null;
  }

  return (
    <Container>
      <SectionTitle>채널</SectionTitle>
      <Gap size={8} />

      <Pressable onPress={handlePress}>
        <InfoWrapper>
          <RoundedAvatorView source={channel?.images.avatar || ''} size={64} />
          <ColumnWrapper>
            {isLoading ? (
              <>
                <SkeletonView width={90} height={18} borderRadius={4} />
                <Gap size={4} />
                <SkeletonView width={40} height={14} borderRadius={4} />
              </>
            ) : (
              <>
                <Name>{channel?.name}</Name>
                <SubscriberCount>{channel?.subscriberText}명</SubscriberCount>
              </>
            )}
          </ColumnWrapper>
          <RightArrowIcon style={{ width: 24, height: 24 }} />
        </InfoWrapper>
      </Pressable>
    </Container>
  );
}

const Container = styled.View({
  padding: 16,
  marginBottom: 40,
});

const SectionTitle = styled.Text({
  ...textStyles.title2,
});

const InfoWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const ColumnWrapper = styled.View({
  paddingLeft: 12,
  flexDirection: 'column',
  justifyContent: 'center',
  flex: 1,
});

const Name = styled.Text({
  ...textStyles.body1,
});

const SubscriberCount = styled.Text({
  ...textStyles.body3,
  color: colors.gray03,
});

export { ChannelInfoView };
