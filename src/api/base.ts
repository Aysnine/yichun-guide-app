export type ResponseData<T> = {
  success: boolean;
  timestamp: number;
  data: T;
};

export type RequestApiParams = {
  url: string;
  method?:
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT';
  signal?: AbortSignal;
  businessErrorMessage: string;
};

export type QueryValue = string | number | boolean | null | undefined;

export function normalizeEndpoint(endpoint: string) {
  return endpoint.replace(/\/$/, '');
}

export function buildQuery(params: Record<string, QueryValue>) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join('&');

  return query ? `?${query}` : '';
}

export function buildUrl(
  endpoint: string,
  path: string,
  query?: Record<string, QueryValue> | string,
) {
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const queryString =
    typeof query === 'string'
      ? query
      : query
        ? buildQuery(query)
        : '';

  return `${normalizedEndpoint}${normalizedPath}${queryString}`;
}

function createAbortError() {
  const abortError = new Error('Request aborted');
  abortError.name = 'AbortError';
  return abortError;
}

export async function requestApi<T>({
  url,
  method = 'GET',
  signal,
  businessErrorMessage,
}: RequestApiParams) {
  const res = await new Promise<ResponseData<T>>((resolve, reject) => {
    let settled = false;
    const abortError = createAbortError();

    function cleanup() {
      signal?.removeEventListener('abort', onAbort);
    }

    function onAbort() {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      requestTask.abort();
      reject(abortError);
    }

    const requestTask = wx.request<ResponseData<T>>({
      url,
      method,
      success: (res) => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();

        if (!res.data.success) {
          reject(new Error(businessErrorMessage));
          return;
        }

        resolve(res.data);
      },
      fail: (err) => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();

        if (signal?.aborted) {
          reject(abortError);
          return;
        }

        reject(new Error(err.errMsg));
      },
    });

    if (signal?.aborted) {
      onAbort();
      return;
    }

    signal?.addEventListener('abort', onAbort, { once: true });
  });

  return res.data;
}
