import glob from "fast-glob";
import * as path from "path";

import { Spot } from "@/types/spots.type";

async function importFile(file: string): Promise<Spot[]> {
  const content = await import(`../data/spots/${file}`);
  const propertyName = Object.keys(content)[0];
  return content[propertyName];
}

export async function getAllSpots(): Promise<Spot[]> {
  const fileNames = await glob("*.ts", {
    cwd: path.join(process.cwd(), "src/data/spots"),
  });

  const spotsArrays = await Promise.all(fileNames.map(importFile));

  const spots: Spot[] = spotsArrays.flat();

  return spots;
}
