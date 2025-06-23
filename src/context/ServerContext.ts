import { inject, provide, reactive } from '@vue-mini/core';

export type ServerContextType = {
  endpoint: string;
};

const serverContextSymbol = Symbol('server');

export function provideServer(endpoint: string) {
  const serverContext = reactive<ServerContextType>({
    endpoint: endpoint,
  });

  provide(serverContextSymbol, serverContext);

  return serverContext;
}

export function useServer() {
  return inject<ServerContextType>(serverContextSymbol)!;
}
