import {
  QueryClient,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
} from '@tanstack/query-core';
import { useQueryClient } from './useQueryClient';
import { onUnload, ref } from '@vue-mini/core';

export function useQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >,
  queryClient?: QueryClient,
) {
  const contextQueryClient = useQueryClient();

  const observer = new QueryObserver<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >(queryClient || contextQueryClient, options);

  const state = ref(observer.getCurrentResult());

  const unsubscribe = observer.subscribe((result) => {
    state.value = result;
  });

  onUnload(() => {
    unsubscribe();
  });

  return state;
}
