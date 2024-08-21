import { useSystemInfo } from '@/context/SystemInfoContext';
import { computed, defineComponent, ref } from '@vue-mini/core';

// TODO import theme.json maybe
const themes = {
  light: {
    style: 'black',
    color: '#181818',
    bgColor: '#ffffff',
    homeIcon: '/images/i1s.png',
    homeSelectedIcon: '/images/i1.png',
    specialtyIcon: '/images/i2s.png',
    specialtySelectedIcon: '/images/i2.png',
    mineIcon: '/images/i3s.png',
    mineSelectedIcon: '/images/i3.png',
  },
  dark: {
    style: 'white',
    color: '#ffffff',
    bgColor: '#181818',
    homeIcon: '/images/i1s.png',
    homeSelectedIcon: '/images/i1.png',
    specialtyIcon: '/images/i2s.png',
    specialtySelectedIcon: '/images/i2.png',
    mineIcon: '/images/i3s.png',
    mineSelectedIcon: '/images/i3.png',
  },
};

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      result[key] = obj[key].replace(
        /@(\w+)/g,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_: any, k: string) => replaceMap[k],
      );
    }
  }
  return result;
}

defineComponent({
  properties: {},

  setup: () => {
    const selected = ref(0);
    const { theme } = useSystemInfo();

    const config = computed(() =>
      deepReplaceValue(
        {
          color: '@color',
          selectedColor: '@color',
          backgroundColor: '@bgColor',
          borderStyle: '@style',
          list: [
            {
              text: '景点',
              pagePath: 'pages/home/index',
              iconPath: '@homeIcon',
              selectedIconPath: '@homeSelectedIcon',
            },
            {
              text: '特产',
              pagePath: 'pages/specialty/index',
              iconPath: '@specialtyIcon',
              selectedIconPath: '@specialtySelectedIcon',
            },
          ],
        },
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
