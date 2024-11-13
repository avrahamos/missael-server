import fs from "fs/promises";

export const loadInitialMissilesData = async () => {
  const missilesData = await fs.readFile("missiles.json", "utf-8");
  return JSON.parse(missilesData);
};

export const loadInitialOrganizationData = async () => {
  const organizationData = await fs.readFile("organizations.json", "utf-8");
  return JSON.parse(organizationData);
};

export const calculateMissileTimes = (
  missileSpeed: number,
  distance: number,
  interceptSpeed: number
) => {
  const missileTime = distance / missileSpeed;
  const interceptTime = distance / interceptSpeed;

  return {
    missileTime,
    interceptTime,
    canIntercept: interceptTime <= missileTime,
  };
};
