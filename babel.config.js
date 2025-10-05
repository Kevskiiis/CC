module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 Reanimated MUST be the last plugin
      'react-native-reanimated/plugin',
    ],
  };
};