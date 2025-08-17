import { getYouTubeVideoMetadata } from './ytClient';
import { compareYouTubeLibraries } from './ytClient';

// 테스트 함수
export const testYouTubeAPI = async () => {
  try {
    console.log('🔄 YouTube API 테스트 시작...');

    const testUrl = 'https://www.youtube.com/watch?v=U5TPQoEveJY&t=4s';
    const metadata = await getYouTubeVideoMetadata(testUrl);

    console.log('✅ YouTube API 테스트 성공!');
    console.log('📊 가져온 데이터:', {
      title: metadata.title,
      viewCount: metadata.viewCount,
      likesCount: metadata.likesCount,
      uploadDate: metadata.uploadDate,
      channelName: metadata.channelName,
      duration: metadata.duration,
    });

    return metadata;
  } catch (error) {
    console.error('❌ YouTube API 테스트 실패:', error);
    throw error;
  }
};

const testVideo = 'https://www.youtube.com/watch?v=U5TPQoEveJY&t=4s';

// 🏁 두 라이브러리 성능 비교 테스트
console.log('🚀 YouTube 라이브러리 비교 테스트 시작...');

compareYouTubeLibraries(testVideo)
  .then((results) => {
    console.log('\n🎯 최종 비교 결과:');
    console.log('=====================================');

    if (!results.youtubejs.error) {
      console.log('📺 YouTube.js:');
      console.log(`   - 성능: ${results.youtubejs.duration}ms`);
      console.log(`   - 조회수: ${results.youtubejs.data.viewCount}`);
      console.log(`   - 좋아요: ${results.youtubejs.data.likesCount}`);
      console.log(`   - 채널명: ${results.youtubejs.data.channelName}`);
    } else {
      console.log(`📺 YouTube.js: ❌ 실패 (${results.youtubejs.error})`);
    }

    if (!results.ytdlcore.error) {
      console.log('\n🌐 oEmbed API:');
      console.log(`   - 성능: ${results.ytdlcore.duration}ms`);
      console.log(`   - 조회수: ${results.ytdlcore.data.viewCount}`);
      console.log(`   - 좋아요: ${results.ytdlcore.data.likesCount}`);
      console.log(`   - 채널명: ${results.ytdlcore.data.channelName}`);
    } else {
      console.log(`\n🌐 oEmbed API: ❌ 실패 (${results.ytdlcore.error})`);
    }

    // 승자 결정
    if (!results.youtubejs.error && !results.ytdlcore.error) {
      const winner =
        results.youtubejs.duration < results.ytdlcore.duration ? 'YouTube.js' : 'oEmbed API';
      console.log(`\n🏆 성능 승자: ${winner}`);
    }

    console.log('=====================================');
  })
  .catch((error) => {
    console.error('❌ 테스트 실패:', error);
  });

// 개발 환경에서만 자동 실행
if (__DEV__) {
  setTimeout(() => {
    testYouTubeAPI().catch(console.error);
  }, 2000); // 앱 시작 2초 후 테스트
}
