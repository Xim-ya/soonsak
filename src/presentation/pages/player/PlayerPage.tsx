import { useState, useEffect, useCallback, useRef } from 'react';
import styled from '@emotion/native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Dimensions, ActivityIndicator, Platform, Alert, Linking } from 'react-native';
import { YoutubeView, useYouTubePlayer, useYouTubeEvent } from 'react-native-youtube-bridge';
import colors from '@/shared/styles/colors';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { BasePage } from '@/presentation/components/page/BasePage';
import { BackButtonAppBar } from '@/presentation/components/app-bar/BackButtonAppBar';
import { buildYouTubeUrl, buildYouTubeAppUrl, isEmbeddedRestrictedError } from '@/features/youtube';
import { contentApi } from '@/features/content/api/contentApi';

type PlayerPageRouteProp = RouteProp<RootStackParamList, typeof routePages.player>;

/**
 * YouTube 영상 재생 페이지
 * react-native-youtube-bridge를 사용하여 YouTube 영상을 재생합니다.

 */
export const PlayerPage = () => {
  const route = useRoute<PlayerPageRouteProp>();
  const navigation = useNavigation();
  const { videoId, title, contentId, contentType } = route.params;
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [currentPlaybackRate, setCurrentPlaybackRate] = useState(1);
  const hasIncrementedPlayCount = useRef(false);

  // 초기 화면 크기만 사용 (YouTube 플레이어가 자체적으로 전체화면 처리)
  const screenWidth = Dimensions.get('window').width;

  const player = useYouTubePlayer(videoId, {
    autoplay: true,
    controls: true,
    playsinline: false,
    rel: false,
    muted: false,
  });

  // 플레이어 준비 완료 이벤트
  useYouTubeEvent(player, 'ready', (playerInfo) => {
    console.log('플레이어 준비 완료:', playerInfo);
    setIsPlayerReady(true);

    // 재생수 증가 (1회만 실행)
    if (!hasIncrementedPlayCount.current) {
      hasIncrementedPlayCount.current = true;
      contentApi.incrementPlayCount(contentId, contentType);
    }

    // iOS에서 음소거 상태로 자동 재생 후 음소거 해제
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        player.unMute();
      }, 500);
    }
  });

  // 재생 상태 변경 이벤트
  useYouTubeEvent(player, 'stateChange', (state) => {
    console.log('재생 상태 변경:', state);
  });

  // 재생율 변경 이벤트 - 콜백 함수
  const onPlaybackRateChange = useCallback((rate: number) => {
    console.log('재생율 변경됨:', rate);
    setCurrentPlaybackRate(rate);

    // 사용자에게 재생율 변경 알림 (선택사항)
    if (rate !== 1) {
      console.log(`재생 속도가 ${rate}배로 변경되었습니다`);
    }
  }, []);

  // 재생율 변경 이벤트 리스너
  useYouTubeEvent(player, 'playbackRateChange', onPlaybackRateChange);

  // 재생 진행률 추적 (1초마다)
  const progress = useYouTubeEvent(player, 'progress', 1000);

  useEffect(() => {
    if (progress) {
      console.log('재생 진행:', {
        currentTime: progress.currentTime,
        duration: progress.duration,
        percentage: (progress.currentTime / progress.duration) * 100,
      });
    }
  }, [progress]);

  // 자동 재생 차단 감지
  useYouTubeEvent(player, 'autoplayBlocked', () => {
    console.log('자동 재생이 차단되었습니다');
    // iOS에서 자동 재생이 차단된 경우 수동으로 재생 시도
    if (Platform.OS === 'ios') {
      Alert.alert('자동 재생 차단됨', '재생 버튼을 눌러 영상을 시작하세요', [
        {
          text: '재생',
          onPress: () => player.play(),
        },
      ]);
    }
  });

  // YouTube 앱 열기 함수
  const openInYouTube = useCallback(async () => {
    const youtubeUrl = buildYouTubeUrl(videoId);
    const youtubeAppUrl = buildYouTubeAppUrl(videoId);

    try {
      // YouTube 앱이 설치되어 있는지 확인하고 열기
      const canOpenYouTubeApp = await Linking.canOpenURL(youtubeAppUrl);
      if (canOpenYouTubeApp) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        // YouTube 앱이 없으면 브라우저에서 열기
        await Linking.openURL(youtubeUrl);
      }
    } catch (linkingError) {
      console.error('링크 열기 실패:', linkingError);
      // 링크 열기도 실패한 경우 기본 오류 메시지
      Alert.alert('오류', 'YouTube로 연결할 수 없습니다.');
    }
  }, [videoId]);

  // 에러 이벤트
  useYouTubeEvent(player, 'error', (error) => {
    console.error('플레이어 에러:', error);

    // EMBEDDED_RESTRICTED 오류인 경우 특별 처리
    if (isEmbeddedRestrictedError(error)) {
      Alert.alert('재생 지원 제한', '채널 소유자의 정책으로 YouTube 앱을 실행합니다.', [
        {
          text: '취소',
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'YouTube 열기',
          onPress: async () => {
            await openInYouTube();
            navigation.goBack();
          },
        },
      ]);
    } else {
      // 기타 오류는 기존 처리 방식 + 뒤로 가기
      Alert.alert('재생 오류', `에러 코드: ${error.code}\n${error.message}`, [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  });

  // 16:9 비율로 계산된 높이 (화면 너비에 맞춰)
  const playerWidth = screenWidth;
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
        <YoutubeView
          player={player}
          height={playerHeight}
          width={playerWidth}
          style={{
            opacity: isPlayerReady ? 1 : 0,
            backgroundColor: colors.black,
          }}
          webViewStyle={{
            backgroundColor: colors.black,
          }}
          webViewProps={{
            // 전체화면 지원을 위한 WebView 설정
            allowsInlineMediaPlayback: true,
            mediaPlaybackRequiresUserAction: false,
            allowsFullscreenVideo: true,
            // 추가 보안 설정
            mixedContentMode: 'always',
            domStorageEnabled: true,
          }}
          // 외부 WebView 모드 사용 (전체화면 지원됨)
          useInlineHtml={false}
        />
        {/* 디버그 정보 표시 (개발 중에만 사용) */}
        {__DEV__ && (
          <DebugInfo>
            <DebugText>
              플레이어: {playerWidth}x{Math.floor(playerHeight)}
            </DebugText>
            <DebugText>재생율: {currentPlaybackRate}x</DebugText>
            {progress && (
              <DebugText>
                진행: {Math.floor(progress.currentTime)}s / {Math.floor(progress.duration)}s
              </DebugText>
            )}
          </DebugInfo>
        )}
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

const DebugInfo = styled.View({
  position: 'absolute',
  bottom: 100,
  left: 20,
  backgroundColor: 'rgba(0,0,0,0.7)',
  padding: 10,
  borderRadius: 8,
});

const DebugText = styled.Text({
  color: colors.white,
  fontSize: 12,
  marginVertical: 2,
});
