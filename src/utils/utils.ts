import fs from "fs/promises";
import path from "path";

export const loadInitialMissilesData = async () => {
  const missilesPath = path.join(__dirname, "../data/missiles.json");
  const missilesData = await fs.readFile(missilesPath, "utf-8");
  return JSON.parse(missilesData);
};

export const loadInitialOrganizationData = async () => {
  const organizationPath = path.join(__dirname, "../data/organizations.json");
  const organizationData = await fs.readFile(organizationPath, "utf-8");
  return JSON.parse(organizationData);
};

export const calculateMissileTimes = (
  missileSpeed: number,
  interceptSpeed: number
) => {
  const missileTime =  missileSpeed; 
  const interceptTime =  interceptSpeed; 

  return {
    missileTime,
    interceptTime,
    canIntercept: interceptTime - missileTime > 0
  };
};