import mongoose, { InferSchemaType } from "mongoose";

export enum AccessTypes {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  WORKER = "WORKER",
  COURIER = "COURIER",
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accessType: {
      type: String,
      enum: AccessTypes,
      required: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true,
  }
);

export type NewUser = InferSchemaType<typeof UserSchema>;

export default mongoose.model<NewUser>("User", UserSchema);
