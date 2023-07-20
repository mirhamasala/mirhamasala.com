type CityID =
  | "amsterdam"
  | "barcelona"
  | "melbourne"
  | "sarajevo"
  | "singapore"
  | "tel-aviv";

interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface City {
  canBeSelected: boolean;
  geo: GeoLocation;
  id: CityID;
  label: string;
  post?: string;
}

export const cities: City[] = [
  {
    canBeSelected: true,
    geo: {
      latitude: 52.3676,
      longitude: 4.9041,
    },
    id: "amsterdam",
    label: "Amsterdam",
    post: "/posts/all-my-amsterdam-memories-gather-round-food",
  },
  {
    canBeSelected: true,
    geo: {
      latitude: 41.3851,
      longitude: 2.1734,
    },
    id: "barcelona",
    label: "Barcelona",
    post: undefined,
  },
  {
    canBeSelected: true,
    geo: {
      latitude: -37.8136,
      longitude: 144.9631,
    },
    id: "melbourne",
    label: "Melbourne",
    post: undefined,
  },
  {
    canBeSelected: true,
    geo: {
      latitude: 43.8563,
      longitude: 18.4131,
    },
    id: "sarajevo",
    label: "Sarajevo",
    post: "/posts/sarajevo-favorites",
  },
  {
    canBeSelected: true,
    geo: {
      latitude: 1.3521,
      longitude: 103.8198,
    },
    id: "singapore",
    label: "Singapore",
    post: "/posts/goodbye-little-red-dot",
  },
  {
    canBeSelected: true,
    geo: {
      latitude: 32.0853,
      longitude: 34.7818,
    },
    id: "tel-aviv",
    label: "Tel Aviv",
    post: undefined,
  },
];
