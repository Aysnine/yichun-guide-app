import {
  definePage,
  onShareAppMessage,
  onShareTimeline,
  onShow,
  ref,
} from '@vue-mini/core';
import { Attraction, ResponseData } from '@/types';
import { useFlags } from '@/context/FlagsContext';
import { useServer } from '@/context/ServerContext';

definePage(
  (_, ctx) => {
    const server = useServer();

    const launchOptions = wx.getLaunchOptionsSync();
    const isSinglePage = launchOptions.scene === 1154;

    onShow(() => {
      const tabBar = ctx.getTabBar();
      tabBar.setData({
        selected: 0,
      });
    });
    onShareAppMessage(() => {
      return {
        title: '🌲🐿️【门票价格】【优质特产】🫐🦌',
      };
    });
    onShareTimeline(() => {
      return {
        title: '🌲🐿️【景点门票】【优质特产】🫐🦌',
      };
    });

    const touristAttractions = ref<Attraction[]>([]);
    const refreshTriggered = ref(false);

    let fetching = false;
    fetching = true;
    void getData().then((data) => {
      touristAttractions.value = data;
      fetching = false;
    });

    async function getData() {
      const res = await new Promise<ResponseData<Attraction[]>>(
        (resolve, reject) => {
          wx.request<ResponseData<Attraction[]>>({
            url: `${server.endpoint}/api/attractions?includeTickets=true`,
            method: 'GET',
            success: (res) => {
              resolve(res.data);
            },
            fail: (err) => {
              reject(new Error(err.errMsg));
            },
          });
        },
      );

      return res.data;
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
            touristAttractions.value = data;
            fetching = false;
            refreshTriggered.value = false;
          })
          .catch(() => {
            fetching = false;
            refreshTriggered.value = false;
          });
      }, 1000);
    }

    function onClickTouristAttraction(event: {
      currentTarget: { dataset: { touristAttractionId: string } };
    }) {
      const touristAttractionId =
        event.currentTarget?.dataset.touristAttractionId;

      void wx.navigateTo({
        url: `/pages/tourist-attraction-detail/index?touristAttractionId=${touristAttractionId}`,
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

      touristAttractions,

      refreshTriggered,
      onRefresh,
      onPulling: () => console.log('onPulling'),
      onRestore: () => console.log('onRestore'),
      onAbort: () => console.log('onAbort'),
      onClickTouristAttraction,
      onCallPhone,
      onContact,
    };
  },
  {
    canShareToOthers: true,
    canShareToTimeline: true,
  },
);
