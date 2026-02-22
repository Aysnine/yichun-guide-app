import {
  focusManager,
  notifyManager,
  onlineManager,
} from '@tanstack/query-core';

const _global = typeof globalThis !== 'undefined' ? globalThis : global;

if (typeof _global.AbortController === 'undefined') {
  class AbortSignal {
    aborted: boolean;
    listeners: Record<string, ((event: { type: string }) => void)[]>;

    constructor() {
      this.aborted = false;
      this.listeners = {};
    }
    addEventListener(
      type: string,
      listener: (event: { type: string }) => void,
    ) {
      if (!this.listeners[type]) this.listeners[type] = [];
      this.listeners[type].push(listener);
    }
    removeEventListener(
      type: string,
      listener: (event: { type: string }) => void,
    ) {
      if (!this.listeners[type]) return;
      this.listeners[type] = this.listeners[type].filter((l) => l !== listener);
    }
    dispatchEvent(event: { type: string }) {
      if (this.listeners[event.type]) {
        this.listeners[event.type].forEach((listener) => listener(event));
      }
    }
  }

  class AbortController {
    signal;

    constructor() {
      this.signal = new AbortSignal();
    }
    abort() {
      this.signal.aborted = true;
      this.signal.dispatchEvent({ type: 'abort' });
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  _global.AbortController = AbortController;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  _global.AbortSignal = AbortSignal;
}

notifyManager.setScheduler((callback) => setTimeout(callback, 0));

onlineManager.setEventListener((setOnline) => {
  setOnline(true);
  return () => {};
});

focusManager.setEventListener((setFocused) => {
  setFocused(true);
  return () => {};
});
