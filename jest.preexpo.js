global.__DEV__ = true;
if (!global.__fbBatchedBridgeConfig) {
  global.__fbBatchedBridgeConfig = { remoteModuleConfig: [], localModulesConfig: [] };
}

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  const nativeModules = RN.NativeModules || {};

  nativeModules.NativeUnimoduleProxy = nativeModules.NativeUnimoduleProxy || { viewManagersMetadata: {} };
  nativeModules.UIManager = nativeModules.UIManager || {};
  nativeModules.UIManager.getConstants = nativeModules.UIManager.getConstants || (() => ({ directEventTypes: {} }));
  nativeModules.UIManager.RCTView = nativeModules.UIManager.RCTView || { directEventTypes: {} };
  nativeModules.UIManager.hasViewManagerConfig =
    nativeModules.UIManager.hasViewManagerConfig || (() => true);
  nativeModules.I18nManager =
    nativeModules.I18nManager || {
      getConstants: () => ({ isRTL: false, doLeftAndRightSwapInRTL: false }),
    };
  nativeModules.DeviceEventManager =
    nativeModules.DeviceEventManager || { addListener: () => {}, removeListeners: () => {} };
  nativeModules.PlatformConstants =
    nativeModules.PlatformConstants || { forceTouchAvailable: false, interfaceIdiom: 'phone', isTesting: true };

  return {
    ...RN,
    NativeModules: nativeModules,
  };
});

jest.mock('react-native/Libraries/Utilities/NativePlatformConstantsIOS', () => ({
  default: {
    getConstants: () => ({
      forceTouchAvailable: false,
      interfaceIdiom: 'phone',
      isTesting: true,
    }),
  },
  getConstants: () => ({
    forceTouchAvailable: false,
    interfaceIdiom: 'phone',
    isTesting: true,
  }),
}));

jest.mock('react-native/Libraries/ReactNative/PaperUIManager', () => ({
  default: { getConstants: () => ({ directEventTypes: {} }) },
  getConstants: () => ({ directEventTypes: {} }),
}));

jest.mock('react-native/Libraries/ReactNative/UIManager', () => ({
  default: {
    getConstants: () => ({ directEventTypes: {} }),
    hasViewManagerConfig: () => true,
  },
  getConstants: () => ({ directEventTypes: {} }),
  hasViewManagerConfig: () => true,
}));

jest.mock('react-native/Libraries/ReactNative/I18nManager', () => ({
  default: {
    getConstants: () => ({ isRTL: false, doLeftAndRightSwapInRTL: false }),
  },
  getConstants: () => ({ isRTL: false, doLeftAndRightSwapInRTL: false }),
}));

jest.mock('react-native/Libraries/AppState/NativeAppState', () => ({
  default: {
    getConstants: () => ({ initialAppState: 'active' }),
    getCurrentAppState: (cb) => cb({ app_state: 'active' }),
    addListener: () => {},
    removeListeners: () => {},
  },
  getConstants: () => ({ initialAppState: 'active' }),
  getCurrentAppState: (cb) => cb({ app_state: 'active' }),
  addListener: () => {},
  removeListeners: () => {},
}));

jest.mock('react-native/Libraries/Settings/NativeSettingsManager', () => ({
  default: { getConstants: () => ({ Settings: {} }) },
  getConstants: () => ({ Settings: {} }),
}));

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  default: {
    get: () => ({}),
    getEnforcing: (name) => {
      if (name === 'DeviceInfo') {
        return {
          getConstants: () => ({
            Dimensions: {
              window: { width: 375, height: 667, scale: 1, fontScale: 1 },
              screen: { width: 375, height: 667, scale: 1, fontScale: 1 },
            },
          }),
        };
      }
      return {};
    },
    unstable_enableLegacyModuleInterop: () => {},
  },
  get: () => ({}),
  getEnforcing: (name) => {
    if (name === 'DeviceInfo') {
      return {
        getConstants: () => ({
          Dimensions: {
            window: { width: 375, height: 667, scale: 1, fontScale: 1 },
            screen: { width: 375, height: 667, scale: 1, fontScale: 1 },
          },
        }),
      };
    }
    return {};
  },
  unstable_enableLegacyModuleInterop: () => {},
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
