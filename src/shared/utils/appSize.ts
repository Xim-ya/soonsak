import { Dimensions, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 *  - 앱에서 필요한 디바이스 사이즈 관련 인스턴스들을 초기화하고 필요한 데이터 생성하는 모듈
 *  - 중복된 Dimensions 인스턴스 생성을 방지할 수 있는 이점 있음.
 *  - App.tsx 또는 루트 컴포넌트에서 초기화함.
 */

class SizeConfig {
  private static instance: SizeConfig;
  private dimensionsSubscription: any;

  statusBarHeight: number = 0; // Safe Area 상단 Inset
  bottomInset: number = 0; // Safe Area 하단 Inset
  screenWidth: number = 0; // 디바이스 넓이
  screenHeight: number = 0; // 디바이스 높이
  responsiveBottomInset: number = 0; // 반응형 하단 Safe Area 하단 Inset
  isTablet: boolean = false;

  private constructor() {
    // private 생성자로 외부에서 인스턴스 생성 방지
  }

  // 싱글톤 인스턴스 접근
  static get to(): SizeConfig {
    if (!SizeConfig.instance) {
      SizeConfig.instance = new SizeConfig();
    }
    return SizeConfig.instance;
  }

  // 비율로 처리했을 때 높이 넓이. (375 * 812) 기준
  ratioHeight(givenHeight: number): number {
    return (givenHeight / 812) * this.screenHeight;
  }

  ratioWidth(givenWidth: number): number {
    return (givenWidth / 375) * this.screenWidth;
  }

  // 초기화 구문 (SafeAreaInsets를 파라미터로 받음)
  init(safeAreaInsets?: { top: number; bottom: number }): void {
    const { width, height } = Dimensions.get('window');
    this.isTablet = width > 600;

    // 상태바 높이 설정
    this.statusBarHeight = Platform.select({
      ios: safeAreaInsets?.top || 0,
      android: StatusBar.currentHeight || 0,
      default: 0,
    });

    // 하단 인셋 설정
    this.bottomInset = safeAreaInsets?.bottom || 0;

    // 화면 크기 설정 (태블릿의 경우 고정 크기 사용)
    this.screenWidth = this.isTablet ? 375 : width;
    this.screenHeight = this.isTablet ? 812 : height;

    // 반응형 하단 인셋 설정
    this.responsiveBottomInset = this.bottomInset === 0 ? 16 : this.bottomInset;

    // Dimensions 변경 감지 리스너 추가
    this.dimensionsSubscription = Dimensions.addEventListener(
      'change',
      this.handleDimensionsChange,
    );
  }

  // Dimensions 변경 핸들러
  private handleDimensionsChange = ({ window }: { window: { width: number; height: number } }) => {
    const { width, height } = window;
    this.isTablet = width > 600;
    this.screenWidth = this.isTablet ? 375 : width;
    this.screenHeight = this.isTablet ? 812 : height;
  };

  // 정리 메서드
  destroy(): void {
    this.dimensionsSubscription?.remove();
  }
}

export default SizeConfig;

// 편의를 위한 익스포트
export const AppSize = SizeConfig.to;
