import { createApp } from '@vue-mini/core';
import { provideSystemInfo } from './context/SystemInfoContext';

wx.cloud.init({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  env: wx.cloud.DYNAMIC_CURRENT_ENV,
});

createApp(() => {
  provideSystemInfo();

  console.log('App Launched!');
});
