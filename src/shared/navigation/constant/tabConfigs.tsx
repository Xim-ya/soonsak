import { SvgProps } from 'react-native-svg';
import HomeIcon from '@assets/icons/home_tab.svg';
import ExploreIcon from '@assets/icons/explore_tab.svg';
import SearchIcon from '@assets/icons/search_tab.svg';

enum TabRoutes {
  Home = 'Home',
  Explore = 'Explore',
  Soonsak = 'Soonsak',
}

interface BottomTabItem {
  label: string;
  icon: React.FC<SvgProps>;
}

const TabConfig: Record<TabRoutes, BottomTabItem> = {
  [TabRoutes.Home]: {
    label: '홈',
    icon: HomeIcon,
  },
  [TabRoutes.Explore]: {
    label: '탐색',
    icon: SearchIcon,
  },
  [TabRoutes.Soonsak]: {
    label: '순삭하기',
    icon: ExploreIcon,
  },
};

export { TabRoutes, TabConfig };
