import { definePage, ref } from '@vue-mini/core';
import { Attraction, ResponseData } from '@/types';

definePage((query) => {
  const touristAttractionId = query.touristAttractionId as string;

  const touristAttraction = ref<Attraction | null>(null);

  async function getData() {
    const res = await new Promise<ResponseData<Attraction>>(
      (resolve, reject) => {
        wx.request<ResponseData<Attraction>>({
          url: `https://yichun-guide-server.softfunny.com/api/attractions/${touristAttractionId}`,
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

  void getData().then((data) => {
    touristAttraction.value = data;
  });

  return {
    touristAttraction,
  };
});
