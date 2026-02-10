/**
 * MyPage - MY 탭 화면
 *
 * 사용자 프로필 및 시청 기록을 관리하는 화면입니다.
 * - 프로필 정보 표시
 * - 시청 작품 캘린더
 * - 시청 기록 목록
 */

import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import styled from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BasePage } from '@/presentation/components/page/BasePage';
import colors from '@/shared/styles/colors';
import { AppSize } from '@/shared/utils/appSize';
import type { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { useAuth } from '@/shared/providers/AuthProvider';
import {
  useWatchHistoryCalendar,
  useUniqueWatchHistory,
  type WatchHistoryWithContentDto,
} from '@/features/watch-history';
import { useCalendarNavigation } from './_hooks';
import {
  UserProfileSection,
  WatchCalendar,
  WatchHistoryList,
  MonthYearPickerBottomSheet,
} from './_components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SCROLL_BOTTOM_PADDING = AppSize.ratioHeight(40);

export default function MyPage() {
  const navigation = useNavigation<NavigationProp>();

  // 유저 프로필
  const { displayName, avatarUrl } = useAuth();

  // 캘린더 네비게이션
  const {
    selectedYear,
    selectedMonth,
    isMonthPickerVisible,
    handlePrevMonth,
    handleNextMonth,
    handleOpenMonthPicker,
    handleCloseMonthPicker,
    handleApplyMonthYear,
  } = useCalendarNavigation();

  // 캘린더 시청 기록 조회
  const { data: calendarData, isLoading: isCalendarLoading } = useWatchHistoryCalendar(
    selectedYear,
    selectedMonth,
  );

  // 고유 콘텐츠 시청 기록 조회 (하단 목록용)
  const { data: watchHistoryData, isLoading: isHistoryLoading } = useUniqueWatchHistory(10, 0);

  // 시청 기록 아이템 클릭 핸들러
  const handleWatchHistoryItemPress = useCallback(
    (item: WatchHistoryWithContentDto) => {
      navigation.navigate(routePages.contentDetail, {
        id: item.contentId,
        type: item.contentType,
        title: item.contentTitle,
      });
    },
    [navigation],
  );

  return (
    <BasePage touchableWithoutFeedback={false}>
      <Container>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={SCROLL_CONTENT_STYLE}
          nestedScrollEnabled
        >
          <UserProfileSection displayName={displayName} avatarUrl={avatarUrl} />

          <WatchCalendar
            year={selectedYear}
            month={selectedMonth}
            calendarData={calendarData}
            isLoading={isCalendarLoading}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onOpenMonthPicker={handleOpenMonthPicker}
          />

          {watchHistoryData && (
            <WatchHistoryList
              items={watchHistoryData.items}
              isLoading={isHistoryLoading}
              onItemPress={handleWatchHistoryItemPress}
            />
          )}
        </ScrollView>
      </Container>

      <MonthYearPickerBottomSheet
        visible={isMonthPickerVisible}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onApply={handleApplyMonthYear}
        onClose={handleCloseMonthPicker}
      />
    </BasePage>
  );
}

/* Styles */

const SCROLL_CONTENT_STYLE = {
  paddingBottom: SCROLL_BOTTOM_PADDING,
};

const Container = styled.View({
  flex: 1,
  backgroundColor: colors.black,
});
