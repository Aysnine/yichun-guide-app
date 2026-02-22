import { computed } from '@vue-mini/core';
import { SpecialtyWithImages, requestSpecialties } from '@/api/specialties';
import { useServer } from '@/context/ServerContext';
import { useQuery } from '@/lib/vue-mini-query';

export function useSpecialtiesQuery() {
  const server = useServer();

  const specialtiesQuery = useQuery<SpecialtyWithImages[]>({
    queryKey: ['specialties'],
    queryFn: fetchSpecialties,
  });

  const specialties = computed(() => specialtiesQuery.value.data ?? []);

  async function fetchSpecialties() {
    return requestSpecialties({
      endpoint: server.endpoint,
    });
  }

  return {
    specialtiesQuery,
    specialties,
  };
}
