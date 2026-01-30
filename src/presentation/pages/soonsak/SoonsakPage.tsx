/**
 * SoonsakPage - 순삭하기 탭 화면
 *
 * 드래그하여 콘텐츠를 탐색할 수 있는 인터랙티브 그리드 화면입니다.
 * 검색 버튼을 누르면 랜덤 콘텐츠로 화려한 애니메이션과 함께 포커스됩니다.
 * Flutter flutter_movies 프로젝트의 메인 탐색 페이지를 React Native로 구현했습니다.
 */

import { useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BaseContentModel } from '@/presentation/types/content/baseContentModel';
import { BasePage } from '@/presentation/components/page/BasePage';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { SoonsakHeader } from './_components/SoonsakHeader';
import { ContentGrid, ContentGridRef } from './_components/ContentGrid';

export default function SoonsakPage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const gridRef = useRef<ContentGridRef>(null);

  // 콘텐츠 클릭 핸들러
  const handleContentPress = useCallback(
    (content: BaseContentModel) => {
      navigation.navigate(routePages.contentDetail, {
        id: content.id,
        title: content.title,
        type: content.type,
      });
    },
    [navigation],
  );

  // 검색 버튼 클릭 핸들러 - 랜덤 콘텐츠 포커스
  const handleSearchPress = useCallback(() => {
    gridRef.current?.focusOnRandomContent();
  }, []);

  // 알림 버튼 클릭 핸들러
  const handleNotificationPress = useCallback(() => {
    // TODO: 알림 기능 구현
    console.log('Notification pressed');
  }, []);

  return (
    <BasePage useSafeArea={false} touchableWithoutFeedback={false}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* 드래그 가능한 콘텐츠 그리드 */}
        <ContentGrid ref={gridRef} onContentPress={handleContentPress} />

        {/* 상단 헤더 (오버레이) */}
        <SoonsakHeader
          onSearchPress={handleSearchPress}
          onNotificationPress={handleNotificationPress}
        />
      </GestureHandlerRootView>
    </BasePage>
  );
}
