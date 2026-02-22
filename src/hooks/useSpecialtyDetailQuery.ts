import { computed } from '@vue-mini/core';
import { QueryFunctionContext } from '@tanstack/query-core';
import { requestSpecialtyDetail, SpecialtyWithImages } from '@/api/specialties';
import { useServer } from '@/context/ServerContext';
import { useQuery } from '@/lib/vue-mini-query';

type SpecialtyDetailQueryKey = ['specialty-detail', { specialtyId: string }];

export function useSpecialtyDetailQuery(specialtyId: string) {
  const server = useServer();

  const specialtyDetailQuery = useQuery<
    SpecialtyWithImages,
    Error,
    SpecialtyWithImages,
    SpecialtyDetailQueryKey
  >({
    queryKey: ['specialty-detail', { specialtyId }],
    queryFn: fetchSpecialtyDetail,
  });

  const specialty = computed(() => specialtyDetailQuery.value.data ?? null);

  async function fetchSpecialtyDetail({
    queryKey,
    signal,
  }: QueryFunctionContext<SpecialtyDetailQueryKey>) {
    const [, params] = queryKey;

    return requestSpecialtyDetail({
      endpoint: server.endpoint,
      specialtyId: params.specialtyId,
      signal,
    });
  }

  return {
    specialtyDetailQuery,
    specialty,
  };
}
