import mongoose, { Schema, Document } from "mongoose";
import { MessageSchema, Message } from "./Message";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  isVerified: boolean;
  userWallet: number;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Invalid email"],
    },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },


    isAcceptingMessages: { type: Boolean, default: true },
    messages: [MessageSchema],
    userWallet: { type: Number, default: 0 },
  },
  { timestamps: true }
);


const UserModel =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;
