import {
  DarkedLinearShadow,
  LinearAlign,
} from '@/presentation/components/shadow/DarkedLinearShadow';
import Gap from '@/presentation/components/view/Gap';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { AppSize } from '@/shared/utils/appSize';
import styled from '@emotion/native';
import { FlatList, View, Image } from 'react-native';

const MOCK_DATA: RelatedOtherChannelVideo[] = [
  {
    id: 'OASDFkasdf123',
    title:
      '[일본 여행 vlog] 도쿄 밤거리 산책 [일본 여행 vlog] 도쿄 밤거리 산책 [일본 여행 vlog] 도쿄 밤거리 산책',
    thumnailUrl: 'https://i.ytimg.com/vi/R7QjeLrvOJ4/hq720.jpg',
    channelName: '영남',
    channelLogoImageUrl:
      'https://yt3.ggpht.com/ytc/AIdro_kzHx_o1dOJpR0YRs4UqP0vKfYqF5yYLbZ5k5Ng=s48-c-k-c0x00ffffff-no-rj',
  },
  {
    id: 'OASDFkasdf124',
    title: '서울 야경 명소 TOP 10',
    thumnailUrl: 'https://i.ytimg.com/vi/R7QjeLrvOJ4/hq720.jpg',
    channelName: '여행가이드',
    channelLogoImageUrl:
      'https://yt3.ggpht.com/ytc/AIdro_kzHx_o1dOJpR0YRs4UqP0vKfYqF5yYLbZ5k5Ng=s48-c-k-c0x00ffffff-no-rj',
  },
  {
    id: 'OASDFkasdf125',
    title: '부산 맛집 투어 | 현지인 추천',
    thumnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    channelName: '먹방여행',
    channelLogoImageUrl:
      'https://yt3.ggpht.com/ytc/AIdro_kzHx_o1dOJpR0YRs4UqP0vKfYqF5yYLbZ5k5Ng=s48-c-k-c0x00ffffff-no-rj',
  },
];

interface RelatedOtherChannelVideo {
  id: string;
  title: string;
  thumnailUrl: string; // 원 코드 키 유지
  channelName: string;
  channelLogoImageUrl: string;
}

function OtherChannelVideoListView() {
  const ItemView = ({ item }: { item: RelatedOtherChannelVideo }) => {
    return (
      <VideoItemContainer>
        <ThumbnailWrapper>
          <VideoThumbnail source={{ uri: item.thumnailUrl }} />
          <DarkedLinearShadow height={AppSize.ratioHeight(122)} align={LinearAlign.bottomTop} />
          <ChannelInfoWrapper>
            <ChannelLogo source={{ uri: item.thumnailUrl }} />
            <ChannelName>{item.channelName}</ChannelName>
          </ChannelInfoWrapper>
        </ThumbnailWrapper>
        <Gap size={6} />
        <VideoTitle numberOfLines={2}>{item.title}</VideoTitle>
      </VideoItemContainer>
    );
  };

  return (
    <Container>
      <SectionTitle>다른 채널 영상</SectionTitle>
      <Gap size={10} />
      <VideoListView
        horizontal
        data={MOCK_DATA}
        renderItem={({ item }) => <ItemView item={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Gap size={12} />}
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  );
}

const Container = styled.View({
  backgroundColor: colors.black,
});

const SectionTitle = styled.Text({
  ...textStyles.title2,
  paddingLeft: 16,
});

const VideoItemContainer = styled.View(() => ({
  width: AppSize.ratioWidth(196),
}));

const VideoListView = styled(FlatList<RelatedOtherChannelVideo>)({
  paddingLeft: 16,
});

const ThumbnailWrapper = styled.View(() => ({
  width: AppSize.ratioWidth(196),
  height: AppSize.ratioWidth(196) * (122 / 196),
  borderRadius: 4,
  overflow: 'hidden', // 라운드 적용은 부모에서만
  backgroundColor: 'black', // 로딩 중 배경
}));

// 핵심 변경: 이미지 절대 채움 + borderRadius 제거
const VideoThumbnail = styled.Image({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

const VideoTitle = styled.Text({
  ...textStyles.body3,
  color: colors.white,
});

const ChannelInfoWrapper = styled.View({
  position: 'absolute',
  bottom: 8,
  left: 8,
  right: 8,
  flexDirection: 'row',
  alignItems: 'center',
});

const ChannelLogo = styled.Image({
  width: 28,
  height: 28,
  borderRadius: 14,
  marginRight: 6,
});

const ChannelName = styled.Text({
  ...textStyles.alert1,
  color: colors.gray03,
});

export { OtherChannelVideoListView };
