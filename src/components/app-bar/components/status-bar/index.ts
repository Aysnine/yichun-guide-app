import { defineComponent } from '@vue-mini/core';
import { useSystemInfo } from '@/context/SystemInfoContext';

defineComponent(() => {
  const { statusBarHeight } = useSystemInfo();

  return {
    statusBarHeight,
  };
});
