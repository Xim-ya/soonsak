import { RoundedAvatorView } from '@/presentation/components/image/RoundedAvatarView';
import Gap from '@/presentation/components/view/Gap';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import styled from '@emotion/native';
import RightArrowIcon from '@assets/icons/right_arrrow.svg';
import { Pressable } from 'react-native';

/** 채널 정보를 보여주는 뷰
 */
function ChannelInfoView() {
  return (
    <Container>
      <SectionTitle>채널</SectionTitle>
      <Gap size={8} />
      <Pressable onPress={() => {}}>
        <InfoWrapper>
          <RoundedAvatorView source="https://i.ytimg.com/vi/R7QjeLrvOJ4/hq720.jpg" size={64} />
          <ColumnWrapper>
            <Name>영읽남</Name>
            <SubscriberCount>100만명</SubscriberCount>
          </ColumnWrapper>
          <RightArrowIcon style={{ width: 24, height: 24 }} />
        </InfoWrapper>
      </Pressable>
    </Container>
  );
}

const Container = styled.View({
  padding: 16,
  marginBottom: 48,
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
  flex: 1, // 남은 공간을 모두 차지하여 화살표를 오른쪽 끝으로 밀어냄
});

const Name = styled.Text({
  ...textStyles.body1,
});

const SubscriberCount = styled.Text({
  ...textStyles.body3,
  color: colors.gray03,
});

export { ChannelInfoView };
