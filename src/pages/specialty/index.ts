import {
  definePage,
  onShareAppMessage,
  onShareTimeline,
  onShow,
  ref,
} from '@vue-mini/core';
import { ResponseData, Specialty } from '@/types';
import { useFlags } from '@/context/FlagsContext';

definePage(
  (query, ctx) => {
    const launchOptions = wx.getLaunchOptionsSync();
    const isSinglePage = launchOptions.scene === 1154;

    const autoJumpTo = query.to;

    if (autoJumpTo) {
      void wx.navigateTo({
        url: `/pages/specialty-detail/index?specialtyId=${autoJumpTo}`,
      });
    }

    onShow(() => {
      const tabBar = ctx.getTabBar();
      tabBar.setData({
        selected: 1,
      });
    });
    onShareAppMessage(() => {
      return {
        title: '🌲🐿️伊春今日优质特产🫐🦌',
      };
    });
    onShareTimeline(() => {
      return {
        title: '🌲🐿️伊春今日优质特产🫐🦌',
      };
    });

    const specialties = ref<Specialty[]>([]);
    const refreshTriggered = ref(false);

    let fetching = false;
    fetching = true;
    void getData().then((data) => {
      specialties.value = data.data;
      fetching = false;
    });

    async function getData() {
      const res = await new Promise<ResponseData<Specialty[]>>(
        (resolve, reject) => {
          wx.request<ResponseData<Specialty[]>>({
            url: 'https://yichun-guide-server.softfunny.com/api/specialties',
            method: 'GET',
            success: (res) => {
              const data = res.data;
              function storageUrl(url: string) {
                if (!url) {
                  return '';
                }
                const cleanUrl = url.startsWith('/') ? url : `/${url}`;
                return `https://yichun-guide-server.softfunny.com/storage${cleanUrl}`;
              }

              data.data = data.data.map((item) => ({
                ...item,
                _images: item.images.map((image) => storageUrl(image)),
              }));
              resolve(data);
            },
            fail: (err) => {
              reject(new Error(err.errMsg));
            },
          });
        },
      );

      return res;
    }

    function onRefresh() {
      console.log('onRefresh');
      if (fetching) {
        return;
      }
      refreshTriggered.value = true;

      // TODO can't restore refresher
      setTimeout(() => {
        getData()
          .then((data) => {
            specialties.value = data.data;
            fetching = false;
            refreshTriggered.value = false;
          })
          .catch(() => {
            fetching = false;
            refreshTriggered.value = false;
          });
      }, 1000);
    }

    function onClickSpecialty(event: {
      currentTarget: { dataset: { specialtyId: string } };
    }) {
      const specialtyId = event.currentTarget?.dataset.specialtyId;

      void wx.navigateTo({
        url: `/pages/specialty-detail/index?specialtyId=${specialtyId}`,
      });
    }

    function onCallPhone(event: {
      currentTarget: { dataset: { phone: string } };
    }) {
      const phone = event.currentTarget?.dataset.phone;
      void wx.makePhoneCall({
        phoneNumber: phone,
      });
    }

    function onContact() {
      void wx.navigateTo({
        url: '/pages/contact/index',
      });
    }

    return {
      flags: useFlags(),

      isSinglePage,

      // specialties: specialtiesLocal,
      specialties,

      refreshTriggered,
      onRefresh,
      onPulling: () => console.log('onPulling'),
      onRestore: () => console.log('onRestore'),
      onAbort: () => console.log('onAbort'),

      onClickSpecialty,
      onCallPhone,
      onContact,
    };
  },
  {
    canShareToOthers: true,
    canShareToTimeline: true,
  },
);
