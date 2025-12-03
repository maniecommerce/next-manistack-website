import dbConnect from "@/lib/dbConnect";
import IdentifierModel from "@/model/Identifier.model";
import UserModel from "@/model/User.model";
import { ApiError, ApiSuccess } from "@/types/ApiResponse";
import bcrypt from "bcryptjs";
import { verifyRecaptcha } from "@/helpers/verifyRecaptcha";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, code, recaptchaToken } = await request.json();
    const decodedEmail = decodeURIComponent(email);

    if (!recaptchaToken) {
      console.log(recaptchaToken)
      return ApiError("reCAPTCHA token missing", 400);
    }

    // 1️⃣ Verify reCAPTCHA v3 token
    const recaptchaResponse = await verifyRecaptcha(recaptchaToken,"verify");

    if (!recaptchaResponse.success) {
      return ApiError(`reCAPTCHA failed: ${recaptchaResponse.reason}`, 400);
    }

    // Optional: score threshold (0.5 recommended)
    const MIN_SCORE = 0.5;
    if ((recaptchaResponse.score ?? 0) < MIN_SCORE) {
      return ApiError(
        `reCAPTCHA score too low (${recaptchaResponse.score}). Suspicious activity detected.`,
        403
      );
    }

    

    // 2️⃣ Lookup user in Identifier table
    const user = await IdentifierModel.findOne({ email: decodedEmail });

    if (!user) {
      return ApiError(
        "Verification code expired or invalid. Please sign up again.",
        400
      );
    }

    // 3️⃣ OTP verification
    const isCodeValid = await bcrypt.compare(code, user.verifyCode);
    if (!isCodeValid) {
      return ApiError("Invalid OTP", 400);
    }

    // 4️⃣ Check if already verified
    const alreadyVerified = await UserModel.findOne({
      email: decodedEmail,
      isVerified: true,
    });
    if (alreadyVerified) {
      return ApiError("User already verified", 400);
    }

    // 5️⃣ Save to UserModel
    const newUser = new UserModel({
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      isVerified: true,
      userWallet: 0,
      isAcceptingMessages: true,
      messages: [],
    });
    await newUser.save();

    // 6️⃣ Delete temporary Identifier entry
    await IdentifierModel.deleteOne({ email: decodedEmail });

    return ApiSuccess("User verified successfully", {
      email: newUser.email,
      fullName: newUser.fullName,
      recaptchaScore: recaptchaResponse.score, // optional debug info
    });
  } catch (error) {
    console.error("Error verifying user", error);
    return ApiError("Server error", 500);
  }
}
