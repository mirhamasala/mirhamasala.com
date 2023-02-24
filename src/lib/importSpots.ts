import { amsterdam } from "@/data/spots/amsterdam";
import { sarajevo } from "@/data/spots/sarajevo";

export const spots = {
  amsterdam: [...amsterdam],
  sarajevo: [...sarajevo],
};

export const allSpots = Object.values(spots).flat();

const importSpots = (city: string) => spots[city];

export default importSpots;
