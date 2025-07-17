import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { routePages } from '../constant/routePages';

export const navigateToContentDetail = (
  navigation: NavigationProp<RootStackParamList>,
  contentId: string,
) => {
  navigation.navigate(routePages.contentDetail, { id: contentId });
};

export const navigateToHome = (navigation: NavigationProp<RootStackParamList>) => {
  navigation.navigate(routePages.mainTabs);
};
