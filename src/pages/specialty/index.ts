import {
  definePage,
  onShareAppMessage,
  onShareTimeline,
  onShow,
  ref,
} from '@vue-mini/core';
import { Specialty } from '@/types';

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

    const db = wx.cloud.database();

    let fetching = false;
    fetching = true;
    void getData().then((data) => {
      specialties.value = data;
      fetching = false;
    });

    async function getData() {
      const { total } = await db.collection('Specialty').count();
      const pages = Math.ceil(total / 20);

      const results = await Promise.all(
        Array.from({ length: pages }).map((_, i) =>
          db
            .collection('Specialty')
            .skip(i * 20)
            .limit(20)
            .get()
            .then((data) => data.data as Specialty[]),
        ),
      );

      return results
        .flat()
        .toSorted((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
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
            specialties.value = data;
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
