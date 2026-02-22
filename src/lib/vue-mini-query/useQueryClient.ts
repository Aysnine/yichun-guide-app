import { QueryClient } from '@tanstack/query-core';
import { inject } from '@vue-mini/core';
import { getClientKey } from './utils';

export function useQueryClient(id = '') {
  const clientKey = getClientKey(id);
  const queryClient = inject<QueryClient>(clientKey);
  if (!queryClient) {
    throw new Error('No QueryClient provided');
  }
  return queryClient;
}
