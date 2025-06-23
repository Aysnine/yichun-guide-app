import { definePage, ref } from '@vue-mini/core';
import { Attraction, ResponseData } from '@/types';
import { useServer } from '@/context/ServerContext';

definePage((query) => {
  const server = useServer();

  const touristAttractionId = query.touristAttractionId as string;

  const touristAttraction = ref<Attraction | null>(null);

  async function getData() {
    const res = await new Promise<ResponseData<Attraction>>(
      (resolve, reject) => {
        wx.request<ResponseData<Attraction>>({
          url: `${server.endpoint}/api/attractions/${touristAttractionId}`,
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
