import mongoose, { Schema, Document } from "mongoose";

export interface IIdentifier extends Document {
  fullName: string;
  email: string;
  password: string;
  verifyCode: string;
  expiresAt: Date | null;
}

const IdentifierSchema: Schema<IIdentifier> = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    verifyCode: {
      type: String,
      required: [true, "Verify Code is required"],
    },

   expiresAt: {
  type: Date,
  required: true,
}
  },

  { timestamps: true }
);

const IdentifierModel =
  mongoose.models.Identifier ||
  mongoose.model<IIdentifier>("Identifier", IdentifierSchema);

export default IdentifierModel;
