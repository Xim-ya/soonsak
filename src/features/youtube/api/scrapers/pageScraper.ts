/**
 * YouTube 페이지 스크래퍼
 * 페이지 HTML에서 추가 메타데이터 추출
 */

import { ScrapedVideoData, YouTubeApiError, YouTubeErrorCode } from '../../types';
import { parseAbbreviatedNumber, formatYouTubeDuration } from '../../utils';

/**
 * 작업 분할 유틸리티 - UI 블로킹 방지
 */
const yieldToMain = (delay: number = 5): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

export const pageScraper = {
  /**
   * YouTube 페이지에서 전체 데이터 스크래핑
   */
  async scrapeVideoPage(videoId: string): Promise<ScrapedVideoData> {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    console.log('🔍 YouTube 페이지 스크래핑 시작:', videoId);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        },
      });

      if (!response.ok) {
        throw new YouTubeApiError(
          `페이지 스크래핑 실패: ${response.status}`,
          YouTubeErrorCode.API_ERROR,
        );
      }

      const html = await response.text();
      console.log('📄 HTML 수신 완료:', html.length, '문자');

      return await this.extractDataFromHtml(html);
    } catch (error) {
      if (error instanceof YouTubeApiError) {
        throw error;
      }
      console.error('❌ 페이지 스크래핑 에러:', error);
      throw new YouTubeApiError('페이지 스크래핑 중 오류 발생', YouTubeErrorCode.PARSING_ERROR);
    }
  },

  /**
   * 메트릭스만 빠르게 스크래핑
   */
  async scrapeMetrics(
    videoId: string,
  ): Promise<Pick<ScrapedVideoData, 'viewCount' | 'likeCount' | 'likeText' | 'uploadDate'>> {
    const fullData = await this.scrapeVideoPage(videoId);
    return {
      viewCount: fullData.viewCount,
      likeCount: fullData.likeCount,
      ...(fullData.likeText && { likeText: fullData.likeText }),
      uploadDate: fullData.uploadDate,
    };
  },

  /**
   * HTML에서 데이터 추출
   */
  async extractDataFromHtml(html: string): Promise<ScrapedVideoData> {
    const data: ScrapedVideoData = {
      viewCount: 0,
      likeCount: 0,
      uploadDate: '', // 빈 값으로 초기화, JSON-LD에서 추출된 값으로 덮어씀
      duration: '0:00',
    };

    // HTML에서 직접 업로드 날짜 추출
    this.extractUploadDateFromHtml(html, data);
    await yieldToMain();

    // ytInitialData에서 추가 데이터 추출
    this.extractYtInitialData(html, data);
    await yieldToMain();

    // 메타데이터에서 추가 정보 추출
    this.extractMetadata(html, data);

    console.log('✅ 스크래핑 완료:', {
      viewCount: data.viewCount,
      likeCount: data.likeCount,
      likeText: data.likeText,
      uploadDate: data.uploadDate,
      duration: data.duration,
    });

    return data;
  },

  /**
   * ytInitialData에서 데이터 추출
   */
  extractYtInitialData(html: string, data: ScrapedVideoData): void {
    const ytDataMatch = html.match(/var\s+ytInitialData\s*=\s*({[\s\S]*?});/);
    if (!ytDataMatch || !ytDataMatch[1]) return;

    try {
      const ytData = JSON.parse(ytDataMatch[1]);
      console.log('🎯 ytInitialData 파싱 성공');

      // 좋아요 수 추출 시도
      const likeButtonPaths = [
        // 최신 YouTube 구조
        ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]
          ?.videoPrimaryInfoRenderer?.videoActions?.menuRenderer?.topLevelButtons?.[0]
          ?.segmentedLikeDislikeButtonViewModel?.likeButtonViewModel?.likeButtonViewModel
          ?.toggleButtonViewModel?.toggleButtonViewModel?.defaultButtonViewModel?.buttonViewModel
          ?.title,
        // 대체 경로
        ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]
          ?.videoPrimaryInfoRenderer?.videoActions?.menuRenderer?.topLevelButtons?.[0]
          ?.toggleButtonRenderer?.defaultText?.accessibility?.accessibilityData?.label,
      ];

      for (const path of likeButtonPaths) {
        if (!path) continue;

        const likeData = this.extractLikeCount(path);
        if (likeData.count > 0) {
          data.likeCount = likeData.count;
          if (likeData.text) {
            data.likeText = likeData.text;
          }
          console.log('✅ 좋아요:', data.likeText || data.likeCount);
          break;
        }
      }

      // 채널 정보 추출
      const channelInfo =
        ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[1]
          ?.videoSecondaryInfoRenderer?.owner?.videoOwnerRenderer;

      if (channelInfo) {
        const channelTitle = channelInfo.title?.runs?.[0]?.text;
        if (channelTitle) {
          data.channelName = channelTitle;
        }
        // channelId는 현재 타입에서 제거됨
      }
    } catch (error) {
      console.log('❌ ytInitialData 파싱 실패:', error);
    }
  },

  /**
   * 메타데이터에서 추가 정보 추출
   */
  extractMetadata(html: string, data: ScrapedVideoData): void {
    // 조회수가 없으면 메타데이터에서 추출
    if (!data.viewCount) {
      const viewCountMatch = html.match(/"viewCount":"(\d+)"/);
      if (viewCountMatch?.[1]) {
        data.viewCount = parseInt(viewCountMatch[1]);
        console.log('✅ 메타데이터 조회수:', data.viewCount);
      }
    }

    // 영상 길이 추출 (duration이 없으면)
    if (!data.duration || data.duration === '0:00') {
      const durationPatterns = [
        /"lengthSeconds":"(\d+)"/, // 초 단위
        /"duration":"PT(\d+)M(\d+)S"/, // ISO 8601 형식
        /"approxDurationMs":"(\d+)"/, // 밀리초 단위
      ];

      for (const pattern of durationPatterns) {
        const match = html.match(pattern);
        if (match) {
          if (pattern.source.includes('lengthSeconds')) {
            const seconds = parseInt(match[1] || '0');
            data.duration = this.formatSecondsToTime(seconds);
            console.log('✅ 메타데이터 길이 (초):', seconds, '→', data.duration);
            break;
          } else if (pattern.source.includes('approxDurationMs')) {
            const ms = parseInt(match[1] || '0');
            const seconds = Math.floor(ms / 1000);
            data.duration = this.formatSecondsToTime(seconds);
            console.log('✅ 메타데이터 길이 (ms):', ms, '→', data.duration);
            break;
          }
        }
      }
    }

    // 좋아요수가 없으면 다양한 방법으로 추출
    if (!data.likeCount) {
      // 1. JSON 데이터에서 좋아요수 찾기
      const likePatterns = [
        /"defaultText":{"accessibility":{"accessibilityData":{"label":"([^"]*좋아요[^"]*)"}}/,
        /"likeCountText":"([^"]+)"/,
        /"toggledText":"([^"]*좋아요[^"]*)"/,
        /"title":"([^"]*좋아요[^"]*)"/,
      ];

      for (const pattern of likePatterns) {
        const match = html.match(pattern);
        if (match?.[1]) {
          const likeData = this.extractLikeCount(match[1]);
          if (likeData.count > 0) {
            data.likeCount = likeData.count;
            if (likeData.text) data.likeText = likeData.text;
            console.log('✅ JSON 패턴 좋아요:', data.likeText || data.likeCount);
            break;
          }
        }
      }

      // 2. aria-label에서 좋아요 수 추출 (백업)
      if (!data.likeCount) {
        const ariaPatterns = [
          /aria-label="[^"]*사용자\s*([\d,]+)\s*명[^"]*좋아/i,
          /aria-label="[^"]*([\d,]+)\s*명[^"]*좋아/i,
          /aria-label="[^"]*([\d,]+)\s*(?:others?|people)?[^"]*like/i,
        ];

        for (const pattern of ariaPatterns) {
          const match = html.match(pattern);
          if (match?.[1]) {
            const num = parseInt(match[1].replace(/,/g, ''));
            if (num > 0 && num < 100000000) {
              data.likeCount = num;
              console.log('✅ aria-label 좋아요:', data.likeCount);
              break;
            }
          }
        }
      }
    }
  },

  /**
   * 좋아요 텍스트에서 숫자 추출
   */
  extractLikeCount(text: string): { count: number; text?: string } {
    if (!text) return { count: 0 };

    // 한국어 축약 (3천, 1.5만)
    const koreanMatch = text.match(/([\d.]+[천만억])/);
    if (koreanMatch?.[1]) {
      return {
        count: parseAbbreviatedNumber(koreanMatch[1]),
        text: koreanMatch[1],
      };
    }

    // 영어 축약 (3K, 1.5M)
    const englishMatch = text.match(/([\d.]+[KMB])/i);
    if (englishMatch?.[1]) {
      return {
        count: parseAbbreviatedNumber(englishMatch[1]),
        text: englishMatch[1],
      };
    }

    // 일반 숫자 (3,072)
    const numMatch = text.match(/([\d,]+)/);
    if (numMatch?.[1] && (numMatch[1].includes(',') || numMatch[1].length >= 4)) {
      const num = parseInt(numMatch[1].replace(/,/g, ''));
      if (num > 100) {
        return { count: num };
      }
    }

    return { count: 0 };
  },

  /**
   * 초를 MM:SS 또는 HH:MM:SS 형식으로 변환
   */
  formatSecondsToTime(totalSeconds: number): string {
    if (!totalSeconds || totalSeconds <= 0) return '0:00';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  /**
   * HTML에서 직접 업로드 날짜 추출 (JSON-LD 실패 시 백업)
   */
  extractUploadDateFromHtml(html: string, data: ScrapedVideoData): void {
    console.log('🔍 HTML에서 uploadDate 직접 추출 시도');

    // 다양한 업로드 날짜 패턴 시도
    const datePatterns = [
      /"uploadDate":"([^"]+)"/,
      /"datePublished":"([^"]+)"/,
      /publishDate['"]:['"]([^'"]+)['"]/,
      /upload.*date['"]:['"]([^'"]+)['"]/i,
      /"publishedTimeText":\s*\{\s*"simpleText"\s*:\s*"([^"]+)"/,
    ];

    for (const pattern of datePatterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        try {
          const dateStr = match[1];
          console.log('🔍 날짜 문자열 발견:', dateStr);

          // ISO 날짜 형식인 경우
          if (dateStr.includes('T') || dateStr.includes('-')) {
            data.uploadDate = new Date(dateStr).toISOString();
            console.log('✅ HTML에서 업로드일 추출:', dateStr, '→', data.uploadDate);
            return;
          }
        } catch (error) {
          console.log('❌ 날짜 파싱 실패:', error);
        }
      }
    }

    console.log('❌ HTML에서도 uploadDate를 찾을 수 없습니다');
  },
};
