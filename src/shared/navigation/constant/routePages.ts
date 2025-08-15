export const routePages = {
  mainTabs: 'MainTabs',
  contentDetail: 'ContentDetail',
  player: 'Player',
} as const;

export type RoutePages = typeof routePages;
