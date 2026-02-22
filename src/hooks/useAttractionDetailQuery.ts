import { computed } from '@vue-mini/core';
import { QueryFunctionContext } from '@tanstack/query-core';
import { Attraction, requestAttractionDetail } from '@/api/attractions';
import { useServer } from '@/context/ServerContext';
import { useQuery } from '@/lib/vue-mini-query';

type AttractionDetailQueryKey = ['attraction-detail', { attractionId: string }];

export function useAttractionDetailQuery(attractionId: string) {
  const server = useServer();

  const attractionDetailQuery = useQuery<
    Attraction,
    Error,
    Attraction,
    AttractionDetailQueryKey
  >({
    queryKey: ['attraction-detail', { attractionId }],
    queryFn: fetchAttractionDetail,
  });

  const attraction = computed(() => attractionDetailQuery.value.data ?? null);

  async function fetchAttractionDetail({
    queryKey,
    signal,
  }: QueryFunctionContext<AttractionDetailQueryKey>) {
    const [, params] = queryKey;

    return requestAttractionDetail({
      endpoint: server.endpoint,
      attractionId: params.attractionId,
      signal,
    });
  }

  return {
    attractionDetailQuery,
    attraction,
  };
}
