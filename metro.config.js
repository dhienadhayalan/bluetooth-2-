// metro.config.js

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    // Add this to support .cjs, .mjs and modern React Native packages
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json', 'cjs', 'mjs'],
  },
  transformer: {
    // Required by Reanimated for JSI support
    babelTransformerPath: require.resolve('react-native-reanimated/scripts/plugin'),
    experimentalImportSupport: false,
    inlineRequires: true,
  },
  watchFolders: [
    // You can include additional folders if needed
  ],
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // Helpful for fixing invalid require() paths
        return middleware(req, res, next);
      };
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
