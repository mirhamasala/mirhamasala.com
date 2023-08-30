export type CityID =
  | "amsterdam"
  | "barcelona"
  | "carvoeira"
  | "encarnação"
  | "ericeira"
  | "madrid"
  | "melbourne"
  | "santo-isidoro"
  | "são-julião"
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
    isPublished: false,
    geo: {
      latitude: 37.0971,
      longitude: 8.471,
    },
    id: "carvoeira",
    label: "carvoeira",
    post: undefined,
  },
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
    isPublished: false,
    geo: {
      latitude: 39.0311,
      longitude: 9.368,
    },
    id: "encarnação",
    label: "Encarnação",
    post: undefined,
  },
  {
    isPublished: true,
    geo: {
      latitude: 38.96685758000395,
      longitude: -9.406102315221707,
    },
    id: "ericeira",
    label: "Ericeira (+ beyond)",
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
    isPublished: false,
    geo: {
      latitude: 38.932,
      longitude: 9.4197,
    },
    id: "são-julião",
    label: "São Julião",
    post: undefined,
  },
  {
    isPublished: false,
    geo: {
      latitude: 38.9938,
      longitude: 9.4003,
    },
    id: "santo-isidoro",
    label: "Santo Isidoro",
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
