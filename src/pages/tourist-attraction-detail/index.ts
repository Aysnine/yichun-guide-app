import { definePage } from '@vue-mini/core';
import { useAttractionDetailQuery } from '@/hooks/useAttractionDetailQuery';

definePage((query) => {
  const touristAttractionId = query.touristAttractionId as string;
  const { attraction: touristAttraction } =
    useAttractionDetailQuery(touristAttractionId);

  return {
    touristAttraction,
  };
});
