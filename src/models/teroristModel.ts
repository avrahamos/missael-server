import mongoose, { Schema, Document } from "mongoose";
import { TeroristOrganizaton } from "../types/enums/location";

export interface ITerorist extends Document {
  userName: string;
  password: string;
  organization: TeroristOrganizaton;
}

const teroristSchema = new Schema<ITerorist>({
  userName: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ITerorist>("soldier", teroristSchema);
