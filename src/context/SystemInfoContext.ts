import { inject, provide, reactive } from '@vue-mini/core';

export type SystemInfoContextType = {
  theme: 'light' | 'dark';
  model: string;
  statusBarHeight: number;
  navigationBarHeight: number;
  appBarHeight: number;
  windowWidth: number;
  horizontalPadding: number;
};

const systemInfoContextSymbol = Symbol('systemInfo');

export function provideSystemInfo() {
  const systemInfo = reactive<SystemInfoContextType>({
    theme: 'light',
    model: '',
    statusBarHeight: 0,
    navigationBarHeight: 0,
    appBarHeight: 0,
    windowWidth: 0,
    horizontalPadding: 0,
  });

  const res = wx.getSystemInfoSync();
  systemInfo.theme = res.theme ?? 'light';
  const { model, statusBarHeight, windowWidth } = res;
  const rect = wx.getMenuButtonBoundingClientRect();
  systemInfo.model = model;
  systemInfo.statusBarHeight = statusBarHeight;
  systemInfo.navigationBarHeight =
    rect.height + (rect.top - statusBarHeight) * 2;
  systemInfo.appBarHeight =
    rect.height + (rect.top - statusBarHeight) * 2 + statusBarHeight;
  systemInfo.windowWidth = windowWidth;
  systemInfo.horizontalPadding = windowWidth - rect.right;

  provide(systemInfoContextSymbol, systemInfo);
}

export function useSystemInfo() {
  return inject<SystemInfoContextType>(systemInfoContextSymbol)!;
}
