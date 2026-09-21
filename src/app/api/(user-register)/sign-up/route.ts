
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

    //1 Recaptcha Verification
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) return ApiError("reCAPTCHA verification failed", 400);

    const existingUserVerified = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingUserVerified) {
      return ApiError("Username is already taken", 400)
    } else {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashOtp = await bcrypt.hash(otp, 10);
      const hashPassword = await bcrypt.hash(password, 10);
      const newIdentifierModel = new IdentifierModel({
        fullName,
        email,
        password: hashPassword,
        verifyCode: hashOtp,
       expiresAt: new Date(Date.now() + 15 * 60 * 1000)
 // 15 minutes expiry
      });

      await newIdentifierModel.save();

      // Send verification email
      const emailResponse = await sendVerificationEmail(
        email,
        fullName,
        otp
      );
      if (!emailResponse.success) {
        return ApiError(emailResponse.message, 500)
      }

      return ApiSuccess("User registered successfullly. Please verify your account", {
        user: {
          username: fullName,
          email: email,
        },
      }
      )

    }
  } catch (error) {
    console.error('Error registering user:', error);
    return ApiError("Server error", 500)


  }
}
