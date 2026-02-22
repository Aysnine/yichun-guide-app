import { buildUrl, requestApi } from './base';

export type Attraction = {
  id: string;
  name: string;
  alias: string[];
  images: string[];
  description: string;
  location: {
    latitude: number;
    longitude: number;
    fullAddress: string;
  };
  priority: number | null;
};

export type AttractionTicket = {
  id: string;
  attractionId: string;
  name: string;
  price: number;
  discount: number | null;
  description: string;
  priority: number | null;
};

export type RequestAttractionsParams = {
  endpoint: string;
  includeTickets: boolean;
  signal?: AbortSignal;
};

export type RequestAttractionDetailParams = {
  endpoint: string;
  attractionId: string;
  signal?: AbortSignal;
};

export async function requestAttractions({
  endpoint,
  includeTickets,
  signal,
}: RequestAttractionsParams) {
  const url = buildUrl(endpoint, '/api/attractions', { includeTickets });

  return requestApi<Attraction[]>({
    url,
    signal,
    businessErrorMessage: 'Failed to fetch attractions',
  });
}

export async function requestAttractionDetail({
  endpoint,
  attractionId,
  signal,
}: RequestAttractionDetailParams) {
  const url = buildUrl(endpoint, `/api/attractions/${attractionId}`);

  return requestApi<Attraction>({
    url,
    signal,
    businessErrorMessage: 'Failed to fetch attraction detail',
  });
}
