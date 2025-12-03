import mongoose, { Schema, Document } from "mongoose";
export interface IOtpVerification extends Document {
  email: string;
  isVerified: boolean;
  otp: string | null;
  otpExpiryAt: Date | null;
  Attempts: number;

}

const OtpVerificationSchema: Schema<IOtpVerification> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Invalid email"],
    },
    isVerified: { type: Boolean, default: false },

    otp: { type: String, default: null },
    otpExpiryAt: { type: Date, default: Date.now, index: true, expires: 900 },
    Attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);



const OtpVerificationModel =
  mongoose.models.OtpVerification ||
  mongoose.model<IOtpVerification>("OtpVerification", OtpVerificationSchema);

export default OtpVerificationModel;
