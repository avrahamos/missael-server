import mongoose, { Document, Schema } from "mongoose";
import { Location, Organizaton } from "../types/enums/location";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  organization: Organizaton;
  location?: Location;
}

const userSchema = new Schema<IUser>({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
    enum: Object.values(Organizaton),
  },
  location: {
    type: String,
    required: function (this: IUser) {
      return this.organization === Organizaton.IDF;
    },
    enum: Object.values(Location),
  },
});

userSchema.pre("validate", function (next) {
  if (this.organization === Organizaton.IDF && !this.location) {
    next(new Error("Location is required for IDF organization."));
  } else {
    next();
  }
});

export default mongoose.model<IUser>("User", userSchema);
