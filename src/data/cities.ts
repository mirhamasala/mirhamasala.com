type CityID =
  | "amsterdam"
  | "barcelona"
  | "madrid"
  | "melbourne"
  | "sarajevo"
  | "singapore"
  | "tel-aviv";

interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface City {
  isPublished: boolean;
  geo: GeoLocation;
  id: CityID;
  label: string;
  post?: string;
}

export const cities: City[] = [
  {
    isPublished: true,
    geo: {
      latitude: 52.3676,
      longitude: 4.9041,
    },
    id: "amsterdam",
    label: "Amsterdam",
    post: "/posts/all-my-amsterdam-memories-gather-round-food",
  },
  {
    isPublished: true,
    geo: {
      latitude: 41.3851,
      longitude: 2.1734,
    },
    id: "barcelona",
    label: "Barcelona",
    post: undefined,
  },
  {
    isPublished: true,
    geo: {
      latitude: 40.4167754,
      longitude: -3.7037902,
    },
    id: "madrid",
    label: "Madrid",
    post: undefined,
  },
  {
    isPublished: true,
    geo: {
      latitude: -37.8136,
      longitude: 144.9631,
    },
    id: "melbourne",
    label: "Melbourne",
    post: undefined,
  },
  {
    isPublished: true,
    geo: {
      latitude: 43.8563,
      longitude: 18.4131,
    },
    id: "sarajevo",
    label: "Sarajevo",
    post: "/posts/sarajevo-favorites",
  },
  {
    isPublished: true,
    geo: {
      latitude: 1.2860229769167766,
      longitude: 103.8572152796645,
    },
    id: "singapore",
    label: "Singapore",
    post: "/posts/goodbye-little-red-dot",
  },
  {
    isPublished: true,
    geo: {
      latitude: 32.0853,
      longitude: 34.7818,
    },
    id: "tel-aviv",
    label: "Tel Aviv",
    post: undefined,
  },
];

export const publishedCities = cities.filter((city) => city.isPublished);
