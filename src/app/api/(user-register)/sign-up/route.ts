import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User.model";
import IdentifierModel from "@/model/Identifier.model";
import { ApiError, ApiSuccess } from "@/types/ApiResponse";
import { verifyRecaptcha } from "@/helpers/verifyRecaptcha";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { fullName, email, password, recaptchaToken } = await request.json();

    if (!recaptchaToken) {
      return ApiError("reCAPTCHA token missing", 400);
    }

    // 1️⃣ Professional reCAPTCHA v3 Verification
    const recaptchaResponse = await verifyRecaptcha(recaptchaToken, "signup");

    if (!recaptchaResponse.success) {
      return ApiError(`reCAPTCHA failed: ${recaptchaResponse.reason}`, 400);
    }

    // Optional: check score threshold
    const MIN_SCORE = 0.5; // recommended threshold
    if (recaptchaResponse.score < MIN_SCORE) {
      return ApiError(
        `reCAPTCHA score too low (${recaptchaResponse.score}). Suspicious activity detected.`,
        403
      );
    }

    // Optional: verify action matches
    if ((recaptchaResponse as any).action !== "signup") {
      return ApiError(
        `Invalid reCAPTCHA action. Expected "signup" but got "${(recaptchaResponse as any).action}"`,
        400
      );
    }

    // 2️⃣ Check if verified user already exists
    const existingUser = await UserModel.findOne({ email, isVerified: true });
    if (existingUser) {
      return ApiError("Email is already registered & verified", 400);
    }

    // 3️⃣ OTP + password hashing
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const identifier = new IdentifierModel({
      fullName,
      email,
      password: hashedPassword,
      verifyCode: hashedOtp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    await identifier.save();

    // 4️⃣ Send verification email
    const emailResponse = await sendVerificationEmail(email, fullName, otp);
    if (!emailResponse.success) {
      return ApiError(emailResponse.message, 500);
    }

    return ApiSuccess(
      "User registered successfully. Please verify your account.",
      {
        user: { username: fullName, email },
        recaptchaScore: recaptchaResponse.score, // optional debug info
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return ApiError("Server error", 500);
  }
}
