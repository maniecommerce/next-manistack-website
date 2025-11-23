import dbConnect from "@/lib/dbConnect";
import IdentifierModel from "@/model/Identifier.model";
import UserModel from "@/model/User.model";
import { ApiError, ApiSuccess } from "@/types/ApiResponse";
import bcrypt from "bcryptjs";
import { verifyRecaptcha } from "@/helpers/verifyRecaptcha";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, code } = await request.json();
    const decodedEmail = decodeURIComponent(email);

    // 1. Identifier table me user dhoondo
    const user = await IdentifierModel.findOne({ email: decodedEmail });
   

    if (!user) {
      return ApiError(
        "Verification code expired. Please sign up again.",
        400
      );
    }

    // 2. OTP verify karo (OTP hashed hoga isliye compare)
    const isCodeValid = await bcrypt.compare(code, user.verifyCode);

    if (!isCodeValid) {
      return ApiError("Invalid OTP", 400);
    }

    // 3. Check if user already verified
    const alreadyExists = await UserModel.findOne({
      email: decodedEmail,
      isVerified: true,
    });

    if (alreadyExists) {
      return ApiError("User already verified", 400);
    }

    // 4. UserModel me save karo
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

    // 5. Identifier temporary entry delete kar do
    await IdentifierModel.deleteOne({ email: decodedEmail });

    return ApiSuccess("User verified successfully", {
      email: newUser.email,
      fullName: newUser.fullName,
    });

  } catch (error) {
    console.log("Error verifying user", error);
    return ApiError("Server error", 500);
  }
}
