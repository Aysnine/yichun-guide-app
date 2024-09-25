type Collection<T> = T & { _id: string };

export type TouristAttraction = Collection<{
  name: string;
  notice: string;
  desc: string;
  pos: {
    coordinates: [number, number];
    type: 'Point';
  };
  images: {
    url: string;
  }[];
  points: {
    name: string;
    desc: string;
    pos: {
      coordinates: [number, number];
      type: 'Point';
    };
    images: {
      url: string;
    }[];
    pointId: string;
    priority: number | null;
  }[];
  tickets: {
    name: string;
    price: number;
    discount: number | null;
    desc: string;
    points?: string[];
    priority: number | null;
  }[];
  priority: number | null;
}>;

export type Specialty = Collection<{
  name: string;
  highlight: string;
  desc: string;
  images: {
    url: string;
  }[];
  priority: number | null;
}>;
