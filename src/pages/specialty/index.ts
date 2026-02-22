import {
  definePage,
  onShareAppMessage,
  onShareTimeline,
  onShow,
  ref,
} from '@vue-mini/core';
import { useFlags } from '@/context/FlagsContext';
import { useSpecialtiesQuery } from '@/hooks/useSpecialtiesQuery';

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
        title: '🌲🐿️优质特产🫐🦌',
      };
    });
    onShareTimeline(() => {
      return {
        title: '🌲🐿️优质特产🫐🦌',
      };
    });

    const { specialtiesQuery, specialties } = useSpecialtiesQuery();
    const refreshTriggered = ref(false);

    function onRefresh() {
      console.log('onRefresh');
      refreshTriggered.value = true;

      void specialtiesQuery.value.refetch().finally(() => {
        refreshTriggered.value = false;
      });
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
