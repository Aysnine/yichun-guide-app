import { inject, provide, reactive } from '@vue-mini/core';

export type FlagsContextType = {
  privateInfusion: boolean;
};

const flagsContextSymbol = Symbol('flags');

export function provideFlags() {
  const flags = reactive<FlagsContextType>({
    privateInfusion: false,
  });

  provide(flagsContextSymbol, flags);

  return flags;
}

export function useFlags() {
  return inject<FlagsContextType>(flagsContextSymbol)!;
}
