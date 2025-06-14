module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["expo-router", { root: "./src/app" }],
      "nativewind/babel",
      "react-native-reanimated/plugin",
    ],
  };
};
