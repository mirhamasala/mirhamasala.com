import { City } from "@/graphql/documents";

export type Cities = {
  [key: string]: Omit<City, "spots">;
};

export const cities: Cities = {
  // all: {
  //   geo: {
  //     latitude: 43.86127936483994,
  //     longitude: 18.434925465236446,
  //   },
  //   id: "all",
  //   label: "All",
  //   post: "/map",
  // },
  amsterdam: {
    geo: {
      latitude: 52.3676,
      longitude: 4.9041,
    },
    id: "amsterdam",
    label: "Amsterdam",
    post: "/posts/all-my-amsterdam-memories-gather-round-food",
  },
  sarajevo: {
    geo: {
      latitude: 43.8563,
      longitude: 18.4131,
    },
    id: "sarajevo",
    label: "Sarajevo",
    post: "/posts/sarajevo-favorites",
  },
  singapore: {
    geo: {
      latitude: 1.3521,
      longitude: 103.8198,
    },
    id: "singapore",
    label: "Singapore",
    post: "/posts/goodbye-little-red-dot",
  },
  "tel-aviv": {
    geo: {
      latitude: 32.0853,
      longitude: 34.7818,
    },
    id: "tel-aviv",
    label: "Tel Aviv",
    post: "",
  },
};
