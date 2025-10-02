export const CODE_VERSION = '1.1.8';

const accountInfo = wx.getAccountInfoSync();

const miniEnv = accountInfo.miniProgram.envVersion;

export const SERVER_ENDPOINT =
  miniEnv === 'release'
    ? 'https://yichun-guide-server.softfunny.com'
    : 'https://yichun-guide-server.softfunny.com/dev';
