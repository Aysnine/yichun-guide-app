import { buildUrl, requestApi } from './base';

export type Specialty = {
  id: string;
  name: string;
  highlight: string | null;
  description: string;
  images: string[];
  priority: number | null;
};

export type SpecialtyWithImages = Specialty & {
  _images: string[];
};

export type RequestSpecialtiesParams = {
  endpoint: string;
};

export type RequestSpecialtyDetailParams = {
  endpoint: string;
  specialtyId: string;
  signal?: AbortSignal;
};

function toStorageUrl(endpoint: string, url: string) {
  if (!url) {
    return '';
  }

  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return buildUrl(endpoint, `/storage${cleanUrl}`);
}

export async function requestSpecialties({ endpoint }: RequestSpecialtiesParams) {
  const url = buildUrl(endpoint, '/api/specialties');

  const res = await requestApi<Specialty[]>({
    url,
    businessErrorMessage: 'Failed to fetch specialties',
  });

  return res.map((item) => ({
    ...item,
    _images: item.images.map((image) => toStorageUrl(endpoint, image)),
  }));
}

export async function requestSpecialtyDetail({
  endpoint,
  specialtyId,
  signal,
}: RequestSpecialtyDetailParams) {
  const url = buildUrl(endpoint, `/api/specialties/${specialtyId}`);

  const res = await requestApi<Specialty>({
    url,
    signal,
    businessErrorMessage: 'Failed to fetch specialty detail',
  });

  return {
    ...res,
    _images: res.images.map((image) => toStorageUrl(endpoint, image)),
  };
}
