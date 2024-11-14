import { Socket } from "socket.io";

export interface GetDefensesData {
  location: string;
}

export interface InterceptMissileData {
  defenseName: string;
  missileSpeed: number;
  distance: number;
  interceptSpeed: number;
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
export interface UserPayload {
  userId: string;
  email: string;
  organization: string;
  location: string;
}

export interface CustomSocket extends Socket {
 
    user?: UserPayload;
  
}