export const VUE_MINI_QUERY_CLIENT = 'VUE_MINI_QUERY_CLIENT';

export function getClientKey(key?: string) {
  const suffix = key ? `:${key}` : '';
  return `${VUE_MINI_QUERY_CLIENT}${suffix}`;
}
