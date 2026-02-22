import { computed } from '@vue-mini/core';
import { QueryFunctionContext } from '@tanstack/query-core';
import { Attraction, requestAttractions } from '@/api/attractions';
import { useServer } from '@/context/ServerContext';
import { useQuery } from '@/lib/vue-mini-query';

type UseAttractionsQueryOptions = {
  includeTickets?: boolean;
};

type AttractionsQueryKey = [
  'attractions',
  { query: { includeTickets: boolean } },
];

export function useAttractionsQuery(options?: UseAttractionsQueryOptions) {
  const server = useServer();
  const includeTickets = options?.includeTickets ?? false;

  const attractionsQuery = useQuery<
    Attraction[],
    Error,
    Attraction[],
    AttractionsQueryKey
  >({
    queryKey: ['attractions', { query: { includeTickets } }],
    queryFn: fetchAttractions,
  });

  const attractions = computed(() => attractionsQuery.value.data ?? []);

  async function fetchAttractions({
    signal,
    queryKey,
  }: QueryFunctionContext<AttractionsQueryKey>) {
    const [, params] = queryKey;
    return requestAttractions({
      endpoint: server.endpoint,
      includeTickets: params.query.includeTickets,
      signal,
    });
  }

  return {
    attractionsQuery,
    attractions,
  };
}
