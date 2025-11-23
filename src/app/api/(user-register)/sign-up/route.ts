import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User.model";
import { ApiError, ApiSuccess } from "@/types/ApiResponse";
import { verifyRecaptcha } from "@/helpers/verifyRecaptcha";
import IdentifierModel from "@/model/Identifier.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { fullName, email, password, recaptchaToken } = await request.json();

    // 1️⃣ reCAPTCHA Verification with action "signup"
    const recaptcha = await verifyRecaptcha(recaptchaToken, "signup");

    if (!recaptcha.success) {
      return ApiError(`reCAPTCHA failed: ${recaptcha.reason}`, 400);
    }

    // 2️⃣ Check existing verified user
    const existingUserVerified = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingUserVerified) {
      return ApiError("Email is already registered & verified", 400);
    }

    // 3️⃣ OTP + password hashing
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashOtp = await bcrypt.hash(otp, 10);
    const hashPassword = await bcrypt.hash(password, 10);

    const newIdentifierModel = new IdentifierModel({
      fullName,
      email,
      password: hashPassword,
      verifyCode: hashOtp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15min
    });

    await newIdentifierModel.save();

    // 4️⃣ Send Email
    const emailResponse = await sendVerificationEmail(email, fullName, otp);
    if (!emailResponse.success)
      return ApiError(emailResponse.message, 500);

    return ApiSuccess(
      "User registered successfully. Please verify your account.",
      {
        user: { username: fullName, email },
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return ApiError("Server error", 500);
  }
}
