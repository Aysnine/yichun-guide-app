import { QueryClient } from '@tanstack/query-core';
import { getClientKey } from './utils';
import { provide } from '@vue-mini/core';
import '@/lib/vue-mini-query/polyfill';

import {
  notifyManager,
  onlineManager,
  focusManager,
} from '@tanstack/query-core';

notifyManager.setScheduler((callback) => setTimeout(callback, 0));

onlineManager.setEventListener((setOnline) => {
  setOnline(true);
  return () => {};
});

focusManager.setEventListener((setFocused) => {
  setFocused(true);
  return () => {};
});

export function provideQueryClient() {
  const clientKey = getClientKey();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // ! Must be disabled to prevent errors in mini-program environments
        refetchOnWindowFocus: false,
        // ! In mini-program environments, there is no concept of "reconnect", so this should be disabled to prevent errors
        refetchOnReconnect: false,
        // * Default cache time is 5 minutes, which is a reasonable default for most applications. You can adjust this based on your needs.
        staleTime: 1000 * 60 * 5,
        // * In mini-program environments, there is no concept of "network mode", so this should be set to "always" to prevent errors
        networkMode: 'always',
      },
    },
  });

  provide(clientKey, queryClient);
}
