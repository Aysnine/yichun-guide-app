import {
  computed,
  definePage,
  onShareAppMessage,
  onShareTimeline,
  ref,
} from '@vue-mini/core';
import { Specialty } from '@/types';

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

    const specialty = ref<Specialty | null>(null);
    const imageUrls = computed(() => {
      return specialty.value?.images.map((item) => item.url) ?? [];
    });

    onShareAppMessage(() => {
      return {
        title: `🌲🐿️🫐伊春特产【${specialty.value?.name}】${specialty.value?.highlight}`,
        path: '/pages/specialty/index?to=' + specialtyId,
        imageUrl: specialty.value?.images.at(0)?.url,
      };
    });
    onShareTimeline(() => {
      return {
        title: `🌲🐿️🫐伊春特产【${specialty.value?.name}】${specialty.value?.highlight}`,
        query: 'back=list&specialtyId=' + specialtyId,
        imageUrl: specialty.value?.images.at(0)?.url,
      };
    });

    const db = wx.cloud.database();

    void getData().then((data) => {
      specialty.value = data;
    });

    async function getData() {
      return db
        .collection('Specialty')
        .doc(specialtyId)
        .get()
        .then((data) => {
          return data.data as Specialty;
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
