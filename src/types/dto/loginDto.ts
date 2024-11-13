import { Location } from "../enums/location";

export interface LoginDto {
  userName: string;
  password: string;
}

export interface RegisterDto extends LoginDto {
  organization: string;
  location?: Location;
}
