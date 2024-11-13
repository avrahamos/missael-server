export interface GetDefensesData {
  location: string;
}

export interface InterceptMissileData {
  defenseName: string;
  missileSpeed: number;
  distance: number;
  interceptSpeed: number;
}

export interface GetMissilesData {
  organization: string;
}

export interface LaunchMissileData {
  organization: string;
  missileName: string;
  distance: number;
  target: string;
}
export interface IResource {
  name: string;
  amount: number;
  speed: number;
}

export interface IOrganization {
  name: string;
  resources: IResource[];
}