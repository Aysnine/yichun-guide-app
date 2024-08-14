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
  },

  setup: () => {
    const { navigationBarHeight, windowWidth } = useSystemInfo();

    const rect = wx.getMenuButtonBoundingClientRect();
    const paddingHorizontal = windowWidth - rect.right;
    const paddingRight = (windowWidth - rect.right) * 2 + rect.width;
    const menuHeight = rect.height;

    function onClickBack() {
      void wx.navigateBack();
    }

    return {
      navigationBarHeight,

      paddingHorizontal,
      paddingRight,
      menuHeight,

      onClickBack,
    };
  },
});
