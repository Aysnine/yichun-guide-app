import { definePage, onShow, ref } from '@vue-mini/core';
import { useSystemInfo } from '@/context/SystemInfoContext';

definePage((_, ctx) => {
  onShow(() => {
    const tabBar = ctx.getTabBar();
    tabBar.setData({
      selected: 2,
    });
  });

  const greeting = ref('欢迎使用 Vue Mini');
  const systemInfo = useSystemInfo();

  return {
    greeting,
    systemInfo,
  };
});
