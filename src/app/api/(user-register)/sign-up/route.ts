
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User.model";
import OtpVerificationModel from "@/model/OtpVerification.model";
import { ApiError, ApiSuccess } from "@/types/ApiResponse";


import { verifyRecaptcha } from "@/helpers/verifyRecaptcha";


export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password, recaptchaToken } = await request.json();

    //1 Recaptcha Verification
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) return ApiError("reCAPTCHA verification failed", 400);

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return ApiError("Username is already taken", 400)
    }

    const existingUserByEmail = await OtpVerificationModel.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashOtp = await bcrypt.hash(otp, 10);
    const hashPassword = await bcrypt.hash(password, 10);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return ApiError("User already exists with this email", 400)
      } else {

        const hashPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashPassword;
        existingUserByEmail.otp = hashOtp;
        existingUserByEmail.otpExpiryAt = Date.now()
        await existingUserByEmail.save();
      }
    } else {

      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        isVerified: false,
        createdAt: Date.now()
      });

      await newUser.save();

      const newOtpVerificationModel = new OtpVerificationModel({
        otp: hashOtp,
        email: newUser.email,
        otpExpiryAt: Date.now(),
        attempts: +1,
        isVerified: newUser.isVerified
      });

      await newOtpVerificationModel.save()
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      otp
    );
    if (!emailResponse.success) {
      return ApiError(emailResponse.message, 500)
    }

    return ApiSuccess("User registered successfullly. Please verify your account", {
      user: {
        username: username,
        email: email,
      },
    }
    )
  } catch (error) {
    console.error('Error registering user:', error);
    return ApiError("Server error", 500)
  }
}
