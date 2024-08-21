import {
  definePage,
  onShareAppMessage,
  onShareTimeline,
  onShow,
  ref,
} from '@vue-mini/core';

type Collection<T> = T & { _id: string };

export type TouristAttraction = Collection<{
  name: string;
  desc: string;
  pos: {
    coordinates: [number, number];
    type: 'Point';
  };
  images: {
    url: string;
  }[];
  points: {
    name: string;
    desc: string;
    pos: {
      coordinates: [number, number];
      type: 'Point';
    };
    images: {
      url: string;
    }[];
    pointId: string;
    priority: number | null;
  }[];
  tickets: {
    name: string;
    price: number;
    discount: number | null;
    desc: string;
    points?: string[];
    priority: number | null;
  }[];
  priority: number | null;
}>;

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
      const MAX_PAGE = 2; // TODO update if more data

      const results = await Promise.all(
        Array.from({ length: MAX_PAGE }).map((_, i) =>
          db
            .collection('TouristAttraction')
            .skip(i * 20)
            .limit(20)
            .get()
            .then((data) => {
              return (data.data as TouristAttraction[])
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
            }),
        ),
      );

      return results.flat();
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

      // touristAttractions: touristAttractionsLocal,
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
