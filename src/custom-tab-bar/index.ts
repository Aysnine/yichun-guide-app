import { useSystemInfo } from '@/context/SystemInfoContext';
import { computed, defineComponent, ref } from '@vue-mini/core';
import themes from '@/theme.json';
import app from '@/app.json';

defineComponent({
  properties: {},

  setup: () => {
    const selected = ref(0);
    const { theme } = useSystemInfo();

    const config = computed(() =>
      deepReplaceValue(
        app.tabBar,
        (
          themes as {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: Record<string, any>;
          }
        )[theme],
      ),
    );

    function switchTab(event: {
      currentTarget: { dataset: { path: string; index: string } };
    }) {
      const data = event.currentTarget.dataset;
      const url = data.path;
      void wx.switchTab({ url: '/' + url });
      selected.value = Number(data.index);
    }

    return {
      config,

      selected,
      switchTab,
    };
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepReplaceValue<T extends Record<string, any>>(
  obj: T,
  replaceMap: Record<string, string>,
): T {
  const result = {} as T;
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = deepReplaceValue(obj[key], replaceMap);
    } else {
      if (typeof obj[key] === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        result[key] = obj[key].replace(
          /@(\w+)/g,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (_: any, k: string) => replaceMap[k],
        );
      }
    }
  }
  return result;
}
