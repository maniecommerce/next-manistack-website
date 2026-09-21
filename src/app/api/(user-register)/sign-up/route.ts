import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User.model";
import IdentifierModel from "@/model/Identifier.model";
import { ApiError, ApiSuccess } from "@/types/ApiResponse";


export async function POST(request: Request) {
  await dbConnect();

  try {
    const { fullName, email, password} = await request.json()
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
        user: { username: fullName, email }, // optional debug info
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return ApiError("Server error", 500);
  }
}
