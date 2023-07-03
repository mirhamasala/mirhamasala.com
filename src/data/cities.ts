import { City } from "@/graphql/documents";

type Cities = {
  [key: string]: Omit<City, "spots">;
};

export const cities: Cities = {
  all: {
    geo: {
      latitude: 43.86127936483994,
      longitude: 18.434925465236446,
    },
    id: "all",
    label: "All",
    post: "map",
  },
  amsterdam: {
    geo: {
      latitude: 52.36765770163166,
      longitude: 4.905663167791737,
    },
    id: "amsterdam",
    label: "Amsterdam",
    post: "/posts/all-my-amsterdam-memories-gather-round-food",
  },
  sarajevo: {
    geo: {
      latitude: 43.86127936483994,
      longitude: 18.434925465236446,
    },
    id: "sarajevo",
    label: "Sarajevo",
    post: "/posts/sarajevo-favorites",
  },
};
