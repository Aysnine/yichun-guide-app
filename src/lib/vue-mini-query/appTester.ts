import { QueryClient } from '@tanstack/query-core';

export function appTester() {
  console.log('--- 小程序启动，开始测试 TanStack Core ---');

  const qc = new QueryClient({
    defaultOptions: {
      queries: {
        // ! Must be disabled to prevent errors in mini-program environments
        refetchOnWindowFocus: false,
        // ! In mini-program environments, there is no concept of "reconnect", so this should be disabled to prevent errors
        refetchOnReconnect: false,
        // * Default cache time is 5 minutes, which is a reasonable default for most applications. You can adjust this based on your needs.
        // staleTime: 1000 * 60 * 5,
        // * In mini-program environments, there is no concept of "network mode", so this should be set to "always" to prevent errors
        networkMode: 'always',
      },
    },
  });

  // 纯粹的模拟请求
  const mockFetch = async () => {
    console.log('>>> [引擎存活确认] queryFn 被成功调用了！');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success', data: 'Hello TanStack' });
      }, 1000);
    });
  };

  qc.fetchQuery({
    queryKey: ['systemTest'],
    queryFn: mockFetch,
  })
    .then((res) => {
      console.log('>>> [查询成功] 获取到数据:', res);
    })
    .catch((err) => {
      console.error('>>> [查询失败] 报错信息:', err);
    });
}
