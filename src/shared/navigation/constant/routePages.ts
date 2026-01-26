export const routePages = {
  mainTabs: 'MainTabs',
  contentDetail: 'ContentDetail',
  player: 'Player',
  channelDetail: 'ChannelDetail',
} as const;

export type RoutePages = typeof routePages;
