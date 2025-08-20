import {
  computed,
  definePage,
  onShareAppMessage,
  onShareTimeline,
  ref,
} from '@vue-mini/core';
import { ResponseData, Specialty } from '@/types';
import { useFlags } from '@/context/FlagsContext';
import { useServer } from '@/context/ServerContext';

definePage(
  (query) => {
    const server = useServer();

    const launchOptions = wx.getLaunchOptionsSync();
    const isSinglePage = launchOptions.scene === 1154;

    const specialtyId = query.specialtyId as string;
    const needBackHome = query.back === 'list';

    if (!isSinglePage && needBackHome) {
      void wx.reLaunch({
        url: '/pages/specialty/index?to=' + specialtyId,
      });
    }

    const specialty = ref<(Specialty & { _images: string[] }) | null>(null);
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

    void getData().then((data) => {
      specialty.value = data;
    });

    async function getData() {
      const res = await new Promise<
        ResponseData<Specialty & { _images: string[] }>
      >((resolve, reject) => {
        wx.request<ResponseData<Specialty & { _images: string[] }>>({
          url: `${server.endpoint}/api/specialties/${specialtyId}`,
          method: 'GET',
          success: (res) => {
            const data = res.data;
            function storageUrl(url: string) {
              if (!url) {
                return '';
              }
              const cleanUrl = url.startsWith('/') ? url : `/${url}`;
              return `${server.endpoint}/storage${cleanUrl}`;
            }
            data.data._images = data.data.images.map((image) =>
              storageUrl(image),
            );
            resolve(data);
          },
          fail: (err) => {
            reject(new Error(err.errMsg));
          },
        });
      });
      return res.data;
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
