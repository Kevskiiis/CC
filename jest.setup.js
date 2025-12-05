import '@testing-library/jest-native/extend-expect';
import { NativeModules as RNNativeModules } from 'react-native';

try {
  require('react-native-gesture-handler/jestSetup');
} catch (e) {
  // optional
}

// Silence warnings from NativeAnimated (path can vary across versions)
try {
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
} catch (e) {
  // ignore if module path changes
}

// Basic mock for expo-status-bar to avoid JSX rendering issues in tests
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

const nativeModules = RNNativeModules || {};

// Ensure UIManager exists for react-native-paper components during tests
if (!nativeModules.UIManager) {
  nativeModules.UIManager = {};
}
if (!nativeModules.UIManager.getConstants) {
  nativeModules.UIManager.getConstants = () => ({});
}
if (!nativeModules.UIManager.RCTView) {
  nativeModules.UIManager.RCTView = { directEventTypes: {} };
}
if (!nativeModules.PlatformConstants) {
  nativeModules.PlatformConstants = { forceTouchAvailable: false, interfaceIdiom: 'phone', isTesting: true };
}
if (!nativeModules.I18nManager) {
  nativeModules.I18nManager = {
    getConstants: () => ({ isRTL: false, doLeftAndRightSwapInRTL: false }),
  };
}
if (!nativeModules.DeviceEventManager) {
  nativeModules.DeviceEventManager = {
    addListener: () => {},
    removeListeners: () => {},
  };
}

// Mock device info for Dimensions
jest.mock('react-native/Libraries/Utilities/NativeDeviceInfo', () => ({
  getConstants: () => ({
    Dimensions: {
      window: { width: 375, height: 667, scale: 1, fontScale: 1 },
      screen: { width: 375, height: 667, scale: 1, fontScale: 1 },
    },
  }),
}));

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  get: () => ({}),
  getEnforcing: () => ({}),
  unstable_enableLegacyModuleInterop: () => {},
}));

jest.mock('react-native/Libraries/ReactNative/NativeUIManager', () => ({
  getConstants: () => ({ directEventTypes: {} }),
}));

jest.mock('react-native/Libraries/Utilities/NativePlatformConstantsIOS', () => ({
  getConstants: () => ({
    forceTouchAvailable: false,
    interfaceIdiom: 'phone',
    isTesting: true,
  }),
}));

jest.mock('react-native/Libraries/ReactNative/I18nManager', () => ({
  getConstants: () => ({ isRTL: false, doLeftAndRightSwapInRTL: false }),
}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  return function MockNativeEventEmitter() {
    return {
      addListener: () => {},
      removeAllListeners: () => {},
      removeSubscription: () => {},
      removeListeners: () => {},
    };
  };
});

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  ...jest.requireActual('react-native/Libraries/Linking/Linking'),
  addEventListener: (_type, _handler) => ({ remove: () => {} }),
  removeEventListener: () => {},
  openURL: jest.fn(),
  canOpenURL: jest.fn().mockResolvedValue(true),
}));

// Silence noisy deprecation warning from react-test-renderer used by RTL
if (!console.error._silencedForRTR) {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('react-test-renderer is deprecated')) {
      return;
    }
    originalError(...args);
  };
  (console.error)._silencedForRTR = true;
}
