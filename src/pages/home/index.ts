import {
  definePage,
  onShareAppMessage,
  onShareTimeline,
  onShow,
  ref,
} from '@vue-mini/core';
import { useFlags } from '@/context/FlagsContext';
import { useAttractionsQuery } from '@/hooks/useAttractionsQuery';

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
        title: '🌲🐿️【门票价格】【优质特产】🫐🦌',
      };
    });
    onShareTimeline(() => {
      return {
        title: '🌲🐿️【景点门票】【优质特产】🫐🦌',
      };
    });

    const { attractionsQuery, attractions } = useAttractionsQuery({
      includeTickets: true,
    });
    // const fetching = computed(() => attractionsQuery.value.isLoading);
    // const isError = computed(() => attractionsQuery.value.isError);

    const refreshTriggered = ref(false);
    function onRefresh() {
      console.log('onRefresh');
      refreshTriggered.value = true;
      void attractionsQuery.value.refetch().finally(() => {
        refreshTriggered.value = false;
      });
    }

    function onClickAttraction(event: {
      currentTarget: { dataset: { attractionId: string } };
    }) {
      const attractionId = event.currentTarget?.dataset.attractionId;

      void wx.navigateTo({
        url: `/pages/tourist-attraction-detail/index?touristAttractionId=${attractionId}`,
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

      attractions,

      refreshTriggered,
      onRefresh,
      onPulling: () => console.log('onPulling'),
      onRestore: () => console.log('onRestore'),
      onAbort: () => console.log('onAbort'),
      onClickAttraction,
      onCallPhone,
      onContact,
    };
  },
  {
    canShareToOthers: true,
    canShareToTimeline: true,
  },
);
