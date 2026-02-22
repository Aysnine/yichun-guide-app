import {
  computed,
  definePage,
  onShareAppMessage,
  onShareTimeline,
} from '@vue-mini/core';
import { useFlags } from '@/context/FlagsContext';
import { useSpecialtyDetailQuery } from '@/hooks/useSpecialtyDetailQuery';

definePage(
  (query) => {
    const launchOptions = wx.getLaunchOptionsSync();
    const isSinglePage = launchOptions.scene === 1154;

    const specialtyId = query.specialtyId as string;
    const needBackHome = query.back === 'list';

    if (!isSinglePage && needBackHome) {
      void wx.reLaunch({
        url: '/pages/specialty/index?to=' + specialtyId,
      });
    }

    const { specialty } = useSpecialtyDetailQuery(specialtyId);
    const imageUrls = computed(() => {
      return specialty.value?._images ?? [];
    });

    onShareAppMessage(() => {
      return {
        title: `【${specialty.value?.name}】${specialty.value?.highlight}`,
        path: '/pages/specialty/index?to=' + specialtyId,
        imageUrl: specialty.value?._images.at(0),
      };
    });
    onShareTimeline(() => {
      return {
        title: `【${specialty.value?.name}】${specialty.value?.highlight}`,
        query: 'back=list&specialtyId=' + specialtyId,
        imageUrl: specialty.value?._images.at(0),
      };
    });

    function onCallPhone(event: {
      currentTarget: { dataset: { phone: string } };
    }) {
      const phone = event.currentTarget?.dataset.phone;
      void wx.makePhoneCall({
        phoneNumber: phone,
      });
    }

    function onPreviewImage(event: {
      currentTarget: { dataset: { index: number } };
    }) {
      const index = event.currentTarget?.dataset.index;
      void wx.previewImage({
        urls: imageUrls.value,
        current: imageUrls.value.at(index),
      });
    }

    function onContact() {
      void wx.navigateTo({
        url: '/pages/contact/index',
      });
    }

    return {
      flags: useFlags(),

      specialty,
      imageUrls,
      onCallPhone,
      onPreviewImage,
      isSinglePage,
      onContact,
    };
  },
  {
    canShareToOthers: true,
    canShareToTimeline: true,
  },
);
