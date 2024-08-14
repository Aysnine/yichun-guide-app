import { defineComponent } from '@vue-mini/core';
import { useSystemInfo } from '@/context/SystemInfoContext';

defineComponent({
  properties: {
    title: {
      type: String,
      value: '',
    },
    back: {
      type: Boolean,
      value: false,
    },

    extClass: {
      type: String,
      value: '',
    },
  },

  setup: () => {
    const { appBarHeight } = useSystemInfo();

    return {
      appBarHeight,
    };
  },
});
