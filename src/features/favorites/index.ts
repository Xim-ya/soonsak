/**
 * Favorites Feature Module
 * 콘텐츠 찜하기 기능
 */

// Types (DTO)
export type {
  FavoriteDto,
  FavoriteWithContentDto,
  ToggleFavoriteParams,
  FavoriteStatusResponse,
} from './types';

// Types (Model)
export { FavoriteModel, FavoriteStatusModel } from './types/favoriteModel';
export type {
  FavoriteModel as FavoriteModelType,
  FavoriteStatusModel as FavoriteStatusModelType,
} from './types/favoriteModel';

// API
export { favoritesApi } from './api/favoritesApi';

// Hooks
export {
  favoriteKeys,
  useFavoritesCount,
  useFavoriteStatus,
  useToggleFavorite,
  useFavoritesList,
} from './hooks/useFavorites';
