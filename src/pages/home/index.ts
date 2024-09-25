import {
  definePage,
  onShareAppMessage,
  onShareTimeline,
  onShow,
  ref,
} from '@vue-mini/core';
import { TouristAttraction } from '@/types';

definePage(
  (_, ctx) => {
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
        title: '🌲🐿️伊春今日【门票价格】【优质特产】🫐🦌',
      };
    });
    onShareTimeline(() => {
      return {
        title: '🌲🐿️伊春今日【景点门票】【优质特产】🫐🦌',
      };
    });

    const touristAttractions = ref<TouristAttraction[]>([]);
    const refreshTriggered = ref(false);

    const db = wx.cloud.database();

    let fetching = false;
    fetching = true;
    void getData().then((data) => {
      touristAttractions.value = data;
      fetching = false;
    });

    async function getData() {
      const { total } = await db.collection('TouristAttraction').count();
      const pages = Math.ceil(total / 20);

      const results = await Promise.all(
        Array.from({ length: pages }).map((_, i) =>
          db
            .collection('TouristAttraction')
            .skip(i * 20)
            .limit(20)
            .get()
            .then((data) => data.data as TouristAttraction[]),
        ),
      );

      return results
        .flat()
        .toSorted((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
        .map((i) => ({
          ...i,
          points: i.points.toSorted(
            (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
          ),
          tickets: i.tickets.toSorted(
            (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
          ),
        }));
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
