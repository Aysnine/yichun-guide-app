import { definePage, ref } from '@vue-mini/core';
import type { TouristAttraction } from '../home';

definePage((query) => {
  const touristAttractionId = query.touristAttractionId as string;

  const touristAttraction = ref<TouristAttraction | null>(null);

  void wx.cloud
    .database()
    .collection('TouristAttraction')
    .doc(touristAttractionId)
    .get()
    .then((data) => {
      touristAttraction.value = data.data as TouristAttraction;
    });

  return {
    touristAttraction,
  };
});
