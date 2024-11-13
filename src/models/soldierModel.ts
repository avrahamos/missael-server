import mongoose, { Schema, Document } from "mongoose";
import { Location } from "../types/enums/location";

export interface ISoldier extends Document {
  userName: string;
  password: string;
  organization: string;
  location: Location;
}

const soldierSchema = new Schema<ISoldier>({
  userName: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  organization:{
    type:String,
    required:true
  },
  location:{
    type:String,
    required:true
  }
});

export default mongoose.model<ISoldier>("soldier", soldierSchema);
