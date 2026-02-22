import { createApp } from '@vue-mini/core';
import {
  provideSystemInfo,
  SystemInfoContextType,
} from './context/SystemInfoContext';
import { provideFlags } from './context/FlagsContext';
import { requestAppFlag } from './api/flags';
import { provideServer, ServerContextType } from './context/ServerContext';
import { CODE_VERSION, SERVER_ENDPOINT } from './config';
import { provideQueryClient } from './lib/vue-mini-query';

import '@/lib/vue-mini-query/polyfill';

createApp(() => {
  const systemInfo = provideSystemInfo();
  const flags = provideFlags();
  const server = provideServer(SERVER_ENDPOINT);

  provideQueryClient();

  void getFlag(systemInfo, server).then((appFlag) => {
    flags.privateInfusion = appFlag.features.privateInfusion;
  });

  console.log('App Launched!');
});

async function getFlag(
  systemInfo: SystemInfoContextType,
  server: ServerContextType,
) {
  const envMapping: Record<'develop' | 'trial' | 'release', 'dev' | 'test' | 'prod'> = {
    develop: 'dev',
    trial: 'test',
    release: 'prod',
  };

  const env = envMapping[systemInfo.env];
  const version = CODE_VERSION;

  const res = await requestAppFlag({
    endpoint: server.endpoint,
    appType: 'wechat',
    appEnv: env,
    appVersion: version,
  });

  console.log(res);

  return res;
}
