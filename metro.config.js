const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    // CRITICAL: Disable inline requires for hot reload to work
    inlineRequires: false,
    // Enable Fast Refresh
    unstable_allowRequireContext: true,
  },
  resolver: {
    assetExts: require('@react-native/metro-config')
      .getDefaultConfig(__dirname)
      .resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [
      ...require('@react-native/metro-config').getDefaultConfig(__dirname)
        .resolver.sourceExts,
      'svg',
    ],
    platforms: ['ios', 'android', 'web'],
  },
  // CRITICAL: Force enable Fast Refresh
  server: {
    enhanceMiddleware: middleware => {
      return middleware;
    },
  },
  // Enable better file watching
  watchFolders: [],
  // Reset cache to enable changes
  resetCache: true,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
