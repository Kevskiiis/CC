const expoPreset = require('jest-expo/jest-preset');

module.exports = {
  ...expoPreset,
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.preexpo.js'],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js',
  ],
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { presets: ['babel-preset-expo'] },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-vector-icons|@react-navigation|expo-status-bar|expo-asset|expo-modules-core|expo(nent)?|@expo|@unimodules|@react-native-community|@testing-library)/)',
  ],
  moduleNameMapper: {
    ...(expoPreset.moduleNameMapper || {}),
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
};
