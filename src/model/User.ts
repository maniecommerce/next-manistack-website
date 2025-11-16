import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { MessageSchema, Message } from "./Message";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;

  otp: string | null;
  otpExpiry: Date | null;
  otpAttempts: number;
  otpCooldownExpiry: Date | null;

  userWallet: number;
  isAcceptingMessages: boolean;
  messages: Message[];

  setOTP(plainOtp: string): Promise<void>;
  verifyOTP(plainOtp: string): Promise<{ ok: boolean; reason?: string }>;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Invalid email"],
    },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },

    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
    otpCooldownExpiry: { type: Date, default: null },

    isAcceptingMessages: { type: Boolean, default: true },
    messages: [MessageSchema],
    userWallet: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/** -----------------------------
 * SET OTP – USED FOR RESEND TOO
 * ----------------------------- */
UserSchema.methods.setOTP = async function (plainOtp: string) {
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(plainOtp, salt);
  this.otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  this.otpAttempts = 0;
  this.otpCooldownExpiry = null; // remove lock
  await this.save();
};

/** -----------------------------
 * VERIFY OTP WITH ALL CONDITIONS
 * ----------------------------- */
UserSchema.methods.verifyOTP = async function (plainOtp: string) {
  if (!this.otp || !this.otpExpiry)
    return { ok: false, reason: "no_otp" };

  // check lock
  if (this.otpCooldownExpiry && new Date() < this.otpCooldownExpiry) {
    return { ok: false, reason: "locked" };
  }

  // check expiry
  if (new Date() > this.otpExpiry) {
    this.otp = null;
    this.otpExpiry = null;
    this.otpAttempts = 0;
    await this.save();
    return { ok: false, reason: "expired" };
  }

  const match = await bcrypt.compare(plainOtp, this.otp);

  if (match) {
    this.isVerified = true;
    this.otp = null;
    this.otpExpiry = null;
    this.otpAttempts = 0;
    this.otpCooldownExpiry = null;
    await this.save();
    return { ok: true };
  }

  // wrong attempt
  this.otpAttempts += 1;

  if (this.otpAttempts >= 3) {
    this.otpCooldownExpiry = new Date(Date.now() + 45 * 60 * 1000);
    this.otp = null;
    this.otpExpiry = null;
    this.otpAttempts = 0;
    await this.save();
    return { ok: false, reason: "locked" };
  }

  await this.save();
  return { ok: false, reason: "invalid" };
};

/** -----------------------------
 * AUTO CLEAR EXPIRED OTP
 * ----------------------------- */
async function clearExpiredOtp(docs: any) {
  if (!docs) return;
  const arr = Array.isArray(docs) ? docs : [docs];

  for (const doc of arr) {
    if (doc?.otpExpiry && new Date() > doc.otpExpiry) {
      doc.otp = null;
      doc.otpExpiry = null;
      doc.otpAttempts = 0;
      await doc.save();
    }
  }
}

UserSchema.post("find", async function (docs) {
  await clearExpiredOtp(docs);
});
UserSchema.post("findOne", async function (doc) {
  await clearExpiredOtp(doc);
});
UserSchema.post("findOneAndUpdate", async function (doc) {
  await clearExpiredOtp(doc);
});

const UserModel =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;
