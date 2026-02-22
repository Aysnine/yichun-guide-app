import { buildUrl, requestApi } from './base';

export type AppFlag = {
  appName: string;
  appType: 'wechat';
  appEnv: string;
  appVersion: string;
  features: { isCustomServer: boolean; privateInfusion: boolean };
};

export type RequestAppFlagParams = {
  endpoint: string;
  appType: 'wechat';
  appEnv: 'dev' | 'test' | 'prod';
  appVersion: string;
};

export async function requestAppFlag({
  endpoint,
  appType,
  appEnv,
  appVersion,
}: RequestAppFlagParams) {
  const url = buildUrl(endpoint, '/api/flags', {
    appType,
    appEnv,
    appVersion,
  });

  return requestApi<AppFlag>({
    url,
    businessErrorMessage: 'Failed to fetch app flag',
  });
}
