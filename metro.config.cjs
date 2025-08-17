const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
    alias: {
      '@assets': path.resolve(__dirname, 'assets'),
      '@': path.resolve(__dirname, 'src'),
      // Node.js 모듈 폴리필 (ytdl-core 지원용)
      stream: 'readable-stream',
      path: 'path-browserify',
      querystring: 'querystring-es3',
      util: 'util',
    },
    unstable_enablePackageExports: true,
  };

  return config;
})();
