import path from "path";
import fs from "fs/promises";
import { IOrganization } from "../types/types";
import { calculateMissileTimes } from "../utils/utils";

export const getMyDefensesService = async (
  location: string
): Promise<IOrganization | null> => {

  try {
    const filePath = path.join(__dirname, "../data/organizations.json");
    const data = await fs.readFile(filePath, "utf-8");
    const organizations: IOrganization[] = JSON.parse(data);


    const locationData = organizations.find((org) => org.name === location);
    if (!locationData) {
      console.error(`No organization found for location: ${location}`);
      return null;
    }

    return locationData;
  } catch (error) {
    console.error("Error reading organizations data:", error);
    throw error;
  }
};
export const defenseMissileLauncherService = async (data: {
  defenseName: string;
  missileSpeed: number;
  distance: number;
  interceptSpeed: number;
}): Promise<{ success: boolean; interceptTime: number } | null> => {

  const handleInterception = (
    missileSpeed: number,
    interceptSpeed: number
  ): { success: boolean; interceptTime: number } => {
    const { missileTime, interceptTime, canIntercept } = calculateMissileTimes(
      missileSpeed,
      interceptSpeed
    );

    if (!canIntercept) {
      console.error(
        " interception failed. Interception too late."
      );
      return { success: false, interceptTime: interceptTime - missileTime };
    }

    return { success: true, interceptTime: interceptTime - missileTime };
  };

  const result = handleInterception(data.missileSpeed, data.interceptSpeed);

  return Promise.resolve(result);
};
