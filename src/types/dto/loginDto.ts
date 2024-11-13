import { Location, Organizaton } from "../enums/location";

export interface LoginDto {
  email: string;
  password: string;
}


export interface RegisterDto  {
  userName: string;
  email: string;
  password: string;
  organization: Organizaton;
  location?: Location;
}
