export const routePages = {
  mainTabs: 'MainTabs',
  contentDetail: 'ContentDetail',
  player: 'Player',
  channelDetail: 'ChannelDetail',
  search: 'Search',
} as const;

export type RoutePages = typeof routePages;
