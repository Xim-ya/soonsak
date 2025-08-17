// YouTube oEmbed API 전용 클라이언트

// YouTube URL에서 비디오 ID 추출
export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// YouTube 비디오 메타데이터 타입 정의
export interface YouTubeVideoMetadata {
  viewCount: number;
  likesCount: number;
  likesText?: string; // 좋아요 수 텍스트 (예: "3천", "1.5만")
  uploadDate: string;
  title: string;
  description: string;
  channelName: string;
  duration: string;
}

// 🚀 백그라운드 작업 실행기
const runInBackground = <T>(task: () => Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    const executeTask = () => {
      requestAnimationFrame(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    };

    // 다음 프레임에서 실행
    setTimeout(executeTask, 0);
  });
};

// 🚀 작업 분할 유틸리티
const yieldToMain = (delay: number = 5): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};


// YouTube oEmbed API를 사용한 메타데이터 추출
export const getYouTubeVideoMetadata = async (
  videoIdOrUrl: string,
): Promise<YouTubeVideoMetadata> => {
  return runInBackground(async () => {
    console.log('🎯 YouTube oEmbed + 스크래핑 API로 시작');

    const videoId =
      videoIdOrUrl.includes('youtube.com') || videoIdOrUrl.includes('youtu.be')
        ? extractVideoId(videoIdOrUrl)
        : videoIdOrUrl;

    if (!videoId) {
      throw new Error('Invalid YouTube URL or video ID');
    }

    const startTime = Date.now();

    // 🚀 1단계: oEmbed API로 기본 정보 가져오기
    await yieldToMain(10);
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    console.log('🔍 oEmbed API 호출 시작:', videoId);

    const oEmbedResponse = await fetch(oEmbedUrl);
    if (!oEmbedResponse.ok) {
      throw new Error(`oEmbed API 실패: ${oEmbedResponse.status}`);
    }
    const oEmbedData = await oEmbedResponse.json();
    console.log('✅ oEmbed API 응답 완료');

    // 🚀 2단계: YouTube 페이지에서 추가 메타데이터 스크래핑
    await yieldToMain(10);
    const youtubePageUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log('🔍 YouTube 페이지 스크래핑 시작');

    let scrapedData = {
      viewCount: 0,
      likesCount: 0,
      likesText: undefined as string | undefined,
      uploadDate: new Date().toISOString(),
      duration: '알 수 없음',
    };

    try {
      // 데스크톱 Chrome User-Agent로 변경 (더 많은 데이터 포함)
      const pageResponse = await fetch(youtubePageUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
        },
      });
      if (pageResponse.ok) {
        const pageHTML = await pageResponse.text();

        // 디버깅을 위해 HTML 일부 확인
        console.log('🔍 HTML 크기:', pageHTML.length, '문자');
        
        // HTML 샘플 확인 (첫 1000자)
        console.log('📝 HTML 샘플 (첫 1000자):');
        console.log(pageHTML.substring(0, 1000));
        
        // 여러 패턴으로 좋아요 버튼 찾기
        const buttonPatterns = [
          /like-button-view-model[\s\S]{0,500}/i,
          /toggle-button-view-model[\s\S]{0,500}/i,
          /button-view-model[\s\S]{0,500}좋아/i,
          /aria-label="[^"]*사용자[^"]*좋아함[^"]*"[\s\S]{0,200}/i,
          // 추가 패턴
          /segmented-like-dislike-button-renderer[\s\S]{0,1000}/i,
          /sentiment-bar-renderer[\s\S]{0,500}/i,
          /"likeStatus":"[^"]+"[\s\S]{0,500}/i,
        ];
        
        let likeButtonHtml = null;
        for (const pattern of buttonPatterns) {
          const match = pageHTML.match(pattern);
          if (match) {
            likeButtonHtml = match[0];
            console.log('🎯 좊아요 버튼 HTML 발견 (패턴:', pattern.source.substring(0, 30) + '...)');
            console.log('📝 매칭된 HTML 일부:', likeButtonHtml.substring(0, 200) + '...');
            break;
          }
        }
        
        if (!likeButtonHtml) {
          console.log('❌ 좋아요 버튼 HTML을 찾을 수 없음');
          // HTML에서 '좋아' 또는 'like' 텍스트가 있는지 확인
          const hasLikeText = pageHTML.includes('좋아') || pageHTML.includes('like');
          console.log('🔍 HTML에 "좋아" 또는 "like" 텍스트 존재:', hasLikeText);
          
          // ytInitialData 확인
          const hasYtData = pageHTML.includes('ytInitialData');
          console.log('🔍 HTML에 ytInitialData 존재:', hasYtData);
        }

        // JSON-LD 스크립트에서 구조화된 데이터 추출
        const jsonLdMatch = pageHTML.match(
          /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s,
        );
        if (jsonLdMatch && jsonLdMatch[1]) {
          try {
            const jsonLd = JSON.parse(jsonLdMatch[1]);
            console.log('🎯 JSON-LD 데이터 발견:', Object.keys(jsonLd));

            // 조회수 추출
            if (jsonLd.interactionStatistic) {
              const viewStat = jsonLd.interactionStatistic.find(
                (stat: any) => stat.interactionType === 'http://schema.org/WatchAction',
              );
              if (viewStat && viewStat.userInteractionCount) {
                scrapedData.viewCount = parseInt(viewStat.userInteractionCount.toString());
                console.log('✅ 조회수 발견:', scrapedData.viewCount);
              }
            }

            // 업로드 날짜 추출
            if (jsonLd.uploadDate) {
              scrapedData.uploadDate = new Date(jsonLd.uploadDate).toISOString();
              console.log('✅ 업로드일 발견:', scrapedData.uploadDate);
            }

            // 길이 추출
            if (jsonLd.duration) {
              scrapedData.duration = formatYouTubeDuration(jsonLd.duration);
              console.log('✅ 길이 발견:', scrapedData.duration);
            }
          } catch (e) {
            console.log('❌ JSON-LD 파싱 실패:', e);
          }
        }

        // 메타데이터에서 추가 정보 추출
        const viewCountMatch = pageHTML.match(/"viewCount":"(\d+)"/);
        if (viewCountMatch && viewCountMatch[1] && !scrapedData.viewCount) {
          scrapedData.viewCount = parseInt(viewCountMatch[1]);
          console.log('✅ 메타데이터에서 조회수 발견:', scrapedData.viewCount);
        }

        // 좋아요 수 추출 - YouTube 정책에 따라 숨겨질 수 있음
        console.log('🔍 좋아요 정보 추출 시작...');
        
        // ytInitialData에서 좋아요 수 찾기 시도
        const ytDataMatch = pageHTML.match(/var\s+ytInitialData\s*=\s*({[\s\S]*?});/);
        if (ytDataMatch && ytDataMatch[1]) {
          try {
            const ytData = JSON.parse(ytDataMatch[1]);
            console.log('🎯 ytInitialData 파싱 성공');
            
            // 좋아요 수 찾기 (여러 경로 시도)
            const paths = [
              // 경로 1
              ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]?.videoPrimaryInfoRenderer?.videoActions?.menuRenderer?.topLevelButtons?.[0]?.segmentedLikeDislikeButtonViewModel?.likeButtonViewModel?.likeButtonViewModel?.toggleButtonViewModel?.toggleButtonViewModel?.defaultButtonViewModel?.buttonViewModel?.title,
              // 경로 2
              ytData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]?.videoPrimaryInfoRenderer?.videoActions?.menuRenderer?.topLevelButtons?.[0]?.toggleButtonRenderer?.defaultText?.accessibility?.accessibilityData?.label,
            ];
            
            for (const path of paths) {
              if (path) {
                console.log('🎯 ytInitialData에서 발견한 텍스트:', path);
                
                // 1. 먼저 한국어 축약 패턴 체크 (3천, 1.5만 등)
                const koreanMatch = path.match(/([\d.]+[천만억])/);
                if (koreanMatch && koreanMatch[1]) {
                  scrapedData.likesText = koreanMatch[1];
                  const num = parseKoreanNumber(koreanMatch[1]);
                  if (num > 0) {
                    scrapedData.likesCount = num;
                    console.log('✅ ytInitialData에서 좋아요 텍스트 추출:', koreanMatch[1], '→', scrapedData.likesCount);
                    break;
                  }
                }
                
                // 2. 영어 축약 패턴 체크 (3K, 1.5M 등)
                const englishMatch = path.match(/([\d.]+[KMB])/i);
                if (englishMatch && englishMatch[1]) {
                  scrapedData.likesText = englishMatch[1];
                  const num = parseKoreanNumber(englishMatch[1]);
                  if (num > 0) {
                    scrapedData.likesCount = num;
                    console.log('✅ ytInitialData에서 좋아요 텍스트 추출:', englishMatch[1], '→', scrapedData.likesCount);
                    break;
                  }
                }
                
                // 3. 마지막으로 순수 숫자 패턴 체크 (3,072 등)
                const numMatch = path.match(/([\d,]+)/);
                if (numMatch && numMatch[1]) {
                  // 쉼표가 포함된 경우에만 (단순 숫자 방지)
                  if (numMatch[1].includes(',') || numMatch[1].length >= 4) {
                    const num = parseInt(numMatch[1].replace(/,/g, ''));
                    if (num > 100) { // 100 이상만 좋아요로 인정
                      scrapedData.likesCount = num;
                      console.log('✅ ytInitialData에서 좋아요 수 추출:', numMatch[1], '→', scrapedData.likesCount);
                      break;
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.log('❌ ytInitialData 파싱 실패:', e);
          }
        }

        // 🎯 최우선 방법: aria-label에서 정확한 숫자 추출
        if (!scrapedData.likesCount) {
          console.log('🔍 최우선 방법: aria-label에서 정확한 숫자 추출');
          await yieldToMain(5);

          // 다양한 aria-label 패턴 시도
          const ariaPatterns = [
            // "나 외에 사용자 3,072명이 이 동영상을 좋아함"
            /aria-label="[^"]*사용자\s*([\d,]+)\s*명[^"]*좋아/i,
            // 좀 더 유연한 패턴
            /aria-label="[^"]*([\d,]+)\s*명[^"]*좋아/i,
            // 영어 패턴 "3,072 others like this"
            /aria-label="[^"]*([\d,]+)\s*(?:others?|people)?[^"]*like/i,
            // 더 단순한 패턴
            /aria-label="[^"]*([\d]{1,3}(?:,\d{3})*)(?!년|월|일)[^"]*"/i,
          ];
          
          for (const pattern of ariaPatterns) {
            const match = pageHTML.match(pattern);
            if (match && match[1]) {
              const num = parseInt(match[1].replace(/,/g, ''));
              if (num > 0 && num < 100000000) { // 유효한 범위 체크
                scrapedData.likesCount = num;
                console.log('✅ aria-label에서 좋아요 수 추출:', match[1], '→', scrapedData.likesCount);
                console.log('   사용된 패턴:', pattern.source);
                break;
              }
            }
          }

          if (!scrapedData.likesCount) {
            console.log('❌ aria-label에서 정확한 숫자 추출 실패');
            // aria-label 속성이 있는지 확인
            const hasAriaLabel = pageHTML.includes('aria-label="');
            console.log('🔍 HTML에 aria-label 속성 존재:', hasAriaLabel);
            if (hasAriaLabel) {
              // aria-label 중 일부 샘플 출력
              const ariaLabels = pageHTML.match(/aria-label="[^"]{0,100}"/g);
              if (ariaLabels) {
                console.log('📝 발견된 aria-label 샘플 (최대 3개):');
                ariaLabels.slice(0, 3).forEach(label => {
                  if (label.includes('좋아') || label.includes('like')) {
                    console.log('  -', label);
                  }
                });
              }
            }
          }
        }

        // 🎯 대체 방법: button-text-content에서 축약된 텍스트 추출
        if (!scrapedData.likesCount || !scrapedData.likesText) {
          console.log('🔍 대체 방법: button-text-content에서 축약된 텍스트 추출');
          await yieldToMain(5);

          // 여러 패턴으로 좋아요 버튼 영역 찾기
          const buttonAreaPatterns = [
            /toggle-button-view-model[\s\S]{0,1500}/i,
            /button-view-model[\s\S]{0,1500}button-text-content/i,
            /aria-label="[^"]*좋아[^"]*"[\s\S]{0,500}button-text-content/i,
            /button[^>]*title="[^"]*좋아[^"]*"[\s\S]{0,500}/i,
          ];
          
          let buttonAreaHtml = null;
          for (const pattern of buttonAreaPatterns) {
            const match = pageHTML.match(pattern);
            if (match) {
              buttonAreaHtml = match[0];
              console.log('🎯 좋아요 버튼 영역 발견 (패턴:', pattern.source.substring(0, 40) + '...)');
              break;
            }
          }
          
          if (buttonAreaHtml) {
            // button-text-content 패턴
            const buttonTextPattern = /(?:yt-spec-)?button(?:-shape-next)?__button-text-content">([^<]+)<\/div>/;
            const buttonTextMatch = buttonAreaHtml.match(buttonTextPattern);
            
            if (buttonTextMatch && buttonTextMatch[1]) {
              const text = buttonTextMatch[1].trim();
              console.log('🎯 button-text-content에서 발견한 텍스트:', text);
              
              // 축약된 텍스트 저장
              scrapedData.likesText = text;
              
              // 숫자로 변환 시도
              if (!scrapedData.likesCount) {
                const num = parseKoreanNumber(text);
                if (num > 0 && num < 100000000) {
                  scrapedData.likesCount = num;
                  console.log('✅ button-text에서 좋아요 수 변환:', text, '→', scrapedData.likesCount);
                } else {
                  console.log('⚠️ 숫자 변환 실패, 텍스트만 저장:', text);
                }
              }
            } else {
              console.log('❌ button-text-content 패턴 매칭 실패');
              // 단순히 숫자 텍스트 찾기
              const simpleNumberMatch = buttonAreaHtml.match(/>([\d.]+[천만억KMk]?)</i);
              if (simpleNumberMatch && simpleNumberMatch[1]) {
                const text = simpleNumberMatch[1].trim();
                console.log('🎯 단순 숫자 텍스트 발견:', text);
                scrapedData.likesText = text;
                const num = parseKoreanNumber(text);
                if (num > 0 && num < 100000000) {
                  scrapedData.likesCount = num;
                  console.log('✅ 단순 텍스트에서 좋아요 수 변환:', text, '→', scrapedData.likesCount);
                }
              }
            }
          } else {
            console.log('❌ 좋아요 버튼 영역을 찾을 수 없음');
            // 전체 HTML에서 button-text-content 직접 찾기
            const directButtonTextMatch = pageHTML.match(/button-text-content">([^<]+)<\/div>/g);
            if (directButtonTextMatch) {
              console.log('🔍 전체 HTML에서 button-text-content 발견:', directButtonTextMatch.length, '개');
              // 첫 몇 개 출력
              directButtonTextMatch.slice(0, 5).forEach((match, idx) => {
                const text = match.replace(/.*">|<\/div>/g, '').trim();
                console.log(`  ${idx + 1}. "${text}"`);
                // 숫자 형태인지 확인
                if (/^[\d.]+[천만억KMk]?$/.test(text) && !scrapedData.likesText) {
                  scrapedData.likesText = text;
                  const num = parseKoreanNumber(text);
                  if (num > 0 && num < 100000000) {
                    scrapedData.likesCount = num;
                    console.log('✅ 발견한 텍스트에서 좋아요 수 추출:', text, '→', scrapedData.likesCount);
                  }
                }
              });
            }
          }
        }


        if (!scrapedData.likesCount && !scrapedData.likesText) {
          console.log('❌ 좋아요 정보 추출 완전 실패 - YouTube 정책상 숨김 또는 동적 로딩');
        } else {
          console.log('🎉 최종 좋아요 정보:');
          console.log('  - likesCount:', scrapedData.likesCount);
          console.log('  - likesText:', scrapedData.likesText);
        }

        console.log('✅ 페이지 스크래핑 완료');
      }
    } catch (error) {
      console.log('❌ 페이지 스크래핑 실패:', error);
    }

    // 🚀 3단계: 데이터 정리 및 결과 구성
    await yieldToMain(5);
    const endTime = Date.now();
    console.log(`⏱️ oEmbed + 스크래핑 완료 (${endTime - startTime}ms)`);

    console.log('🎯 oEmbed + 스크래핑 핵심 데이터:');
    console.log('- title:', oEmbedData.title);
    console.log('- author_name:', oEmbedData.author_name);
    console.log('- viewCount:', scrapedData.viewCount);
    console.log('- likesCount:', scrapedData.likesCount);
    console.log('- likesText:', scrapedData.likesText);

    const title = oEmbedData.title || 'Unknown Title';
    const channelName = oEmbedData.author_name || 'Unknown Channel';

    const result: YouTubeVideoMetadata = {
      viewCount: scrapedData.viewCount,
      likesCount: scrapedData.likesCount,
      ...(scrapedData.likesText && { likesText: scrapedData.likesText }),
      uploadDate: scrapedData.uploadDate,
      title,
      description: `${title} - ${channelName}에서 제공`,
      channelName,
      duration: scrapedData.duration,
    };

    console.log('✅ oEmbed + 스크래핑 백그라운드 처리 완료:', result);
    return result;
  });
};



// YouTube ISO 8601 duration을 MM:SS 형식으로 변환 (예: PT10M30S -> 10:30)
const formatYouTubeDuration = (isoDuration: string): string => {
  try {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (match) {
      const hours = parseInt(match[1] || '0');
      const minutes = parseInt(match[2] || '0');
      const seconds = parseInt(match[3] || '0');

      return hours > 0
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  } catch (e) {
    console.log('❌ Duration 파싱 실패:', e);
  }
  return '알 수 없음';
};

// 한국어 숫자 문자열을 숫자로 변환하는 유틸리티 함수 (6.2천, 1.5만 등)
const parseKoreanNumber = (text: string): number => {
  if (typeof text !== 'string') return 0;

  // 쉼표 제거하고 숫자만 추출
  const cleanText = text.replace(/,/g, '').trim();

  // 🚀 한국어 단위가 있는 경우 먼저 확인 (6.2천, 1.5만 등)
  const koreanMatch = cleanText.match(/(\d+(?:\.\d+)?)\s*([천만억])/);
  if (koreanMatch && koreanMatch[1] && koreanMatch[2]) {
    const numberPart = koreanMatch[1];
    const unit = koreanMatch[2];
    const baseNumber = parseFloat(numberPart);

    switch (unit) {
      case '천':
        return Math.round(baseNumber * 1000);
      case '만':
        return Math.round(baseNumber * 10000);
      case '억':
        return Math.round(baseNumber * 100000000);
      default:
        return 0;
    }
  }

  // K, M 등 영어 단위 (12K, 1.5M 등)
  const englishMatch = cleanText.match(/(\d+(?:\.\d+)?)\s*([KMBkmb])/i);
  if (englishMatch && englishMatch[1] && englishMatch[2]) {
    const numberPart = englishMatch[1];
    const unit = englishMatch[2];
    const baseNumber = parseFloat(numberPart);

    switch (unit.toUpperCase()) {
      case 'K':
        return Math.round(baseNumber * 1000);
      case 'M':
        return Math.round(baseNumber * 1000000);
      case 'B':
        return Math.round(baseNumber * 1000000000);
      default:
        return 0;
    }
  }

  // ⚠️ 단순 숫자인 경우 (마지막에 확인)
  const simpleNumber = parseInt(cleanText);
  if (!isNaN(simpleNumber) && simpleNumber > 0) {
    return simpleNumber;
  }

  return 0;
};

