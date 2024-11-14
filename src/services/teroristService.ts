import path from "path";
import { IOrganization } from "../types/types";
import fs from "fs/promises";

export const getMyMissilesService = async (
  organization: string
): Promise<IOrganization | null> => {

  try {
    const filePath = path.join(__dirname, "../data/organizations.json");
    const data = await fs.readFile(filePath, "utf-8");
    const organizations: IOrganization[] = JSON.parse(data);

    const org = organizations.find((org) => org.name === organization);
    if (!org) {
      console.error(
        "[getMyMissilesService] Organization not found:",
        organization
      );
      return null;
    }

    return org;
  } catch (error) {
    console.error("[getMyMissilesService] Error reading data:", error);
    throw error;
  }
};

export const launchMissileAndUpdateResources = async (data: {
  organization: string;
  missileName: string;
  distance: number;
}): Promise<{ missileName: string; timeToImpact: number } | null> => {

  const filePath = path.join(__dirname, "../data/organizations.json");
  try {
    const dataFromJson: IOrganization[] = JSON.parse(
      await fs.readFile(filePath, "utf-8")
    );

    const organizationData = dataFromJson.find(
      (org) => org.name === data.organization
    );
    if (!organizationData) {
      return null;
    }

    const missile = organizationData.resources.find(
      (res) => res.name === data.missileName
    );
    if (!missile || missile.amount <= 0) {
      return null;
    }

    missile.amount -= 1;
    const missileTime = data.distance / missile.speed;

    return { missileName: data.missileName, timeToImpact: missileTime };
  } catch (error) {
    throw error;
  }
};
