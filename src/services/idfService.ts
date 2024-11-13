import { loadInitialOrganizationData } from "../utils/utils";
import { IOrganization } from "../types/types";
import { calculateMissileTimes } from "../utils/utils";

export const getMyDefensesService = async (
  location: string
): Promise<IOrganization | null> => {
  const organizationsData = await loadInitialOrganizationData();
  return organizationsData.find((org:IOrganization) => org.name === location) || null;
};



export const defenseMissileLauncherService = async ({
  defenseName,
  missileSpeed,
  distance,
  interceptSpeed,
}: {
  defenseName: string;
  missileSpeed: number;
  distance: number;
  interceptSpeed: number;
}): Promise<{ success: boolean; interceptTime: number } | null> => {
  const { missileTime, interceptTime, canIntercept } = calculateMissileTimes(
    missileSpeed,
    distance,
    interceptSpeed
  );

  return {
    success: canIntercept,
    interceptTime,
  };
};
