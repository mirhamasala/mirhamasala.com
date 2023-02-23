import { amsterdam } from "@/data/spots/amsterdam";
import { sarajevo } from "@/data/spots/sarajevo";

export type City = "amsterdam" | "sarajevo";

export const spots = {
  amsterdam: [...amsterdam],
  sarajevo: [...sarajevo],
};

const importSpots = (city: City) => spots[city];

export default importSpots;
