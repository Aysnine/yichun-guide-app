import { inject, provide, reactive } from '@vue-mini/core';

export type SystemInfoContextType = {
  theme: 'light' | 'dark';
  model: string;
  statusBarHeight: number;
  navigationBarHeight: number;
  appBarHeight: number;
  windowWidth: number;
  horizontalPadding: number;
  env: 'develop' | 'trial' | 'release';
};

const systemInfoContextSymbol = Symbol('systemInfo');

function isWxApiSupported(apiName: string) {
  return typeof wx.canIUse === 'function' ? wx.canIUse(apiName) : false;
}

function getCompatibleSystemInfo() {
  const appBaseInfo = isWxApiSupported('getAppBaseInfo')
    ? wx.getAppBaseInfo()
    : null;
  const deviceInfo = isWxApiSupported('getDeviceInfo')
    ? wx.getDeviceInfo()
    : null;
  const windowInfo = isWxApiSupported('getWindowInfo')
    ? wx.getWindowInfo()
    : null;

  if (appBaseInfo && deviceInfo && windowInfo) {
    return {
      theme: appBaseInfo.theme,
      model: deviceInfo.model,
      windowWidth: windowInfo.windowWidth,
      statusBarHeight: windowInfo.statusBarHeight,
    };
  }

  const legacySystemInfo =
    typeof wx.getSystemInfoSync === 'function' ? wx.getSystemInfoSync() : null;

  return {
    theme: appBaseInfo?.theme ?? legacySystemInfo?.theme ?? 'light',
    model: deviceInfo?.model ?? legacySystemInfo?.model ?? '',
    windowWidth: windowInfo?.windowWidth ?? legacySystemInfo?.windowWidth ?? 0,
    statusBarHeight:
      windowInfo?.statusBarHeight ?? legacySystemInfo?.statusBarHeight ?? 0,
  };
}

function getCompatibleEnvVersion(): SystemInfoContextType['env'] {
  const envVersion = wx.getAccountInfoSync?.().miniProgram?.envVersion;

  if (
    envVersion === 'develop' ||
    envVersion === 'trial' ||
    envVersion === 'release'
  ) {
    return envVersion;
  }

  return 'develop';
}

export function provideSystemInfo() {
  const systemInfo = reactive<SystemInfoContextType>({
    theme: 'light',
    model: '',
    statusBarHeight: 0,
    navigationBarHeight: 0,
    appBarHeight: 0,
    windowWidth: 0,
    horizontalPadding: 0,
    env: 'develop',
  });

  const { theme, model, windowWidth, statusBarHeight } =
    getCompatibleSystemInfo();

  systemInfo.theme = theme ?? 'light';
  const rect = wx.getMenuButtonBoundingClientRect();
  systemInfo.model = model;
  systemInfo.statusBarHeight = statusBarHeight;
  systemInfo.navigationBarHeight =
    rect.height + (rect.top - statusBarHeight) * 2;
  systemInfo.appBarHeight =
    rect.height + (rect.top - statusBarHeight) * 2 + statusBarHeight;
  systemInfo.windowWidth = windowWidth;
  systemInfo.horizontalPadding = windowWidth - rect.right;

  systemInfo.env = getCompatibleEnvVersion();

  provide(systemInfoContextSymbol, systemInfo);

  return systemInfo;
}

export function useSystemInfo() {
  return inject<SystemInfoContextType>(systemInfoContextSymbol)!;
}
