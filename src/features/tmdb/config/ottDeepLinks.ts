import { Linking } from 'react-native';

interface OttLinkConfig {
  readonly appScheme?: string;
  readonly webUrl: string;
}

/**
 * TMDB providerId → OTT 앱 딥링크/웹 URL 매핑
 */
const OTT_DEEP_LINKS: Record<number, OttLinkConfig> = {
  8: { appScheme: 'nflx://', webUrl: 'https://www.netflix.com' },
  356: { appScheme: 'wavve://', webUrl: 'https://www.wavve.com' },
  337: { appScheme: 'disneyplus://', webUrl: 'https://www.disneyplus.com' },
  97: { appScheme: 'watcha://', webUrl: 'https://www.watcha.com' },
  2087: { appScheme: 'coupangplay://', webUrl: 'https://www.coupangplay.com' },
  350: { appScheme: 'videos://', webUrl: 'https://tv.apple.com' },
  3: { webUrl: 'https://play.google.com/store/movies' },
  119: { appScheme: 'aiv://', webUrl: 'https://www.primevideo.com' },
  490: { appScheme: 'tving://', webUrl: 'https://www.tving.com' },
};

/**
 * OTT 앱을 딥링크로 실행. 실패 시 웹 URL fallback.
 * (canOpenURL은 iOS Info.plist 등록이 필요하므로 openURL try-catch 방식 사용)
 */
export async function openOttApp(providerId: number): Promise<void> {
  const config = OTT_DEEP_LINKS[providerId];
  if (!config) return;

  if (config.appScheme) {
    try {
      await Linking.openURL(config.appScheme);
      return;
    } catch {
      // 앱 스킴 실패 시 웹 URL fallback
    }
  }

  try {
    await Linking.openURL(config.webUrl);
  } catch {
    // 웹 URL도 열 수 없는 경우 무시
  }
}
