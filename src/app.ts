import { createApp } from '@vue-mini/core';
import {
  provideSystemInfo,
  SystemInfoContextType,
} from './context/SystemInfoContext';
import { provideFlags } from './context/FlagsContext';
import { AppFlag, ResponseData } from './types';
import { provideServer, ServerContextType } from './context/ServerContext';

createApp(() => {
  const systemInfo = provideSystemInfo();
  const flags = provideFlags();
  const server = provideServer(process.env.SERVER_ENDPOINT!);

  void getFlag(systemInfo, server).then((appFlag) => {
    flags.privateInfusion = appFlag.features.privateInfusion;
  });

  console.log('App Launched!');
});

const CODE_VERSION = '1.1.5';

async function getFlag(
  systemInfo: SystemInfoContextType,
  server: ServerContextType,
) {
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
    const version = systemInfo.onlineVersion || CODE_VERSION;

    wx.request<ResponseData<AppFlag>>({
      url: `${server.endpoint}/api/flags?appType=wechat&appEnv=${env}&appVersion=${version}`,
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
