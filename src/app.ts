import { createApp } from '@vue-mini/core';
import { provideSystemInfo } from './context/SystemInfoContext';

createApp(() => {
  const systemInfo = provideSystemInfo();

  async function getFlag() {
    const res = await new Promise<{
      flag: string;
    }>((resolve, reject) => {
      wx.request({
        url: `https://yichun-guide-server.softfunny.com/api/flags?appType=wechat&version=${systemInfo.onlineVersion}&env=${systemInfo.env}`,
        method: 'GET',
        success: (res) => {
          resolve(res.data as { flag: string });
        },
        fail: (err) => {
          reject(new Error(err.errMsg));
        },
      });
    });

    console.log(res);

    return res.flag;
  }

  void getFlag();

  console.log('App Launched!');
});
