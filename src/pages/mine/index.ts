import { useSystemInfo } from '@/context/SystemInfoContext';
import { definePage, ref } from '@vue-mini/core';

definePage(() => {
  const greeting = ref('欢迎使用 Vue Mini');
  const systemInfo = useSystemInfo();

  return {
    greeting,
    systemInfo,
  };
});
