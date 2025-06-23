import { createApp } from '@vue-mini/core';
import {
  provideSystemInfo,
  SystemInfoContextType,
} from './context/SystemInfoContext';
import { provideFlags } from './context/FlagsContext';
import { AppFlag, ResponseData } from './types';

createApp(() => {
  const systemInfo = provideSystemInfo();
  const flags = provideFlags();

  void getFlag(systemInfo).then((appFlag) => {
    flags.privateInfusion = appFlag.features.privateInfusion;
  });

  console.log('App Launched!');
});

async function getFlag(systemInfo: SystemInfoContextType) {
  const res = await new Promise<AppFlag>((resolve, reject) => {
    const envMapping: Record<
      'develop' | 'trial' | 'release',
      'dev' | 'test' | 'prod'
    > = {
      develop: 'dev',
      trial: 'test',
      release: 'prod',
    };

    const env = envMapping[systemInfo.env];
    const version = systemInfo.onlineVersion;

    wx.request<ResponseData<AppFlag>>({
      url: `https://yichun-guide-server.softfunny.com/api/flags?appType=wechat&appEnv=${env}&appVersion=${version}`,
      method: 'GET',
      success: (res) => {
        resolve(res.data.data);
      },
      fail: (err) => {
        reject(new Error(err.errMsg));
      },
    });
  });

  console.log(res);

  return res;
}
