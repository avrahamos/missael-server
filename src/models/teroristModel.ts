import mongoose, { Schema, Document } from "mongoose";

export interface ITerorist extends Document {
  userName: string;
  password: string;
  organization: string;
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
