export type ResponseData<T> = {
  success: boolean;
  timestamp: number;
  data: T;
};

export type AppFlag = {
  appName: string;
  appType: 'wechat';
  appEnv: string;
  appVersion: string;
  features: { isCustomServer: boolean; privateInfusion: boolean };
};

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

export type Specialty = {
  id: string;
  name: string;
  highlight: string | null;
  description: string;
  images: string[];
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
