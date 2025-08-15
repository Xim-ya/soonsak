import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from '@emotion/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Dimensions, ActivityIndicator } from 'react-native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import colors from '@/shared/styles/colors';
import { AppSize } from '@/shared/utils/appSize';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { BasePage } from '@/presentation/components/page/BasePage';
import { BackButtonAppBar } from '@/presentation/components/app-bar/BackButtonAppBar';

type PlayerPageRouteProp = RouteProp<RootStackParamList, typeof routePages.player>;

/**
 * YouTube 영상 재생 페이지
 * react-native-youtube-iframe를 사용하여 YouTube 영상을 재생합니다.
 */
export const PlayerPage = () => {
  const route = useRoute<PlayerPageRouteProp>();
  const { videoId, title } = route.params;
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // 화면 크기 변화 감지
  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // 플레이어 준비 완료 콜백
  const onReady = useCallback(() => {
    setIsPlayerReady(true);
  }, []);

  // 16:9 비율로 계산된 높이 (화면 너비에 맞춰)
  const playerWidth = screenData.width;
  const playerHeight = (playerWidth * 9) / 16;

  return (
    <BasePage backgroundColor={colors.black} statusBarStyle="light-content">
      <BackButtonAppBar
        title={title}
        backgroundColor="rgba(0,0,0,0.8)"
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={999}
      />
      <Container>
        {!isPlayerReady && (
          <LoadingContainer>
            <ActivityIndicator size="small" color={colors.white} />
          </LoadingContainer>
        )}
        <YoutubePlayer
          ref={playerRef}
          height={playerHeight}
          width={playerWidth}
          play={true}
          videoId={videoId}
          onReady={onReady}
          onChangeState={(event: string) => console.log('Player state:', event)}
          forceAndroidAutoplay={true}
          webViewStyle={{
            backgroundColor: colors.black,
          }}
          initialPlayerParams={{
            controls: true,
            showClosedCaptions: false,
            modestbranding: false,
            rel: false,
            iv_load_policy: 3,
            preventFullScreen: false,
          }}
        />
      </Container>
    </BasePage>
  );
};

/* Styled Components */
const Container = styled.View({
  flex: 1,
  backgroundColor: colors.black,
  justifyContent: 'center',
  alignItems: 'center',
});

const LoadingContainer = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: colors.black,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 998,
});
