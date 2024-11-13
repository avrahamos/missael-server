import path from "path";
import fs from "fs/promises";
import { IOrganization } from "../types/types";

export const getMyMissilesService = async (
  organization: string
): Promise<IOrganization | null> => {
  const filePath = path.join(__dirname, "../data/organizations.json");
  const dataFromJson: IOrganization[] = JSON.parse(
    await fs.readFile(filePath, "utf-8")
  );
  return dataFromJson.find((org) => org.name === organization) || null;
};

export const launchMissileAndUpdateResources = async ({
  organization,
  missileName,
  distance,
}: {
  organization: string;
  missileName: string;
  distance: number;
}): Promise<{ missileName: string; timeToImpact: number } | null> => {
  const filePath = path.join(__dirname, "../data/organizations.json");
  const dataFromJson: IOrganization[] = JSON.parse(
    await fs.readFile(filePath, "utf-8")
  );
  const organizationData = dataFromJson.find(
    (org) => org.name === organization
  );

  if (!organizationData) return null;

  const missile = organizationData.resources.find(
    (res) => res.name === missileName
  );
  if (!missile || missile.amount <= 0) return null;

  missile.amount -= 1;
  const missileTime = distance / missile.speed;

  return { missileName, timeToImpact: missileTime };
};
