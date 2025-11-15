import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email } = await request.json();

    if (!username) {
      return Response.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return Response.json(
        { success: false, message: "User already verified" },
        { status: 400 }
      );
    }

    const now = new Date();

    //  If cooldown active (40 minutes)
    if (user.resendCooldownExpiry && user.resendCooldownExpiry > now) {
      const mins = Math.ceil(
        (user.resendCooldownExpiry.getTime() - now.getTime()) / 60000
      );
      return Response.json(
        {
          success: false,
          message: `Resend limit reached. Try again in ${mins} minutes.`,
          cooldown: true,
        },
        { status: 429 }
      );
    }

    //  If resend reached (2 times)
    if (user.resendCount >= 1) {
      user.resendCooldownExpiry = new Date(now.getTime() + 40 * 60000); // 40 mins cooldown
      user.resendCount = 0; // reset after cooldown window
      await user.save();

      return Response.json(
        {
          success: false,
          message: `Resend limit reached. Try again after 40 minutes.`,
          cooldown: true,
        },
        { status: 429 }
      );
    }

    // Generate new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyCode = newOTP;
    user.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour validity
    user.resendCount += 1;

    await user.save();

 // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      newOTP
    );
    
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "OTP resent successfully",
        remaining: 2 - user.resendCount, // How many attempts left
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to resend OTP",
      },
      { status: 500 }
    );
  }
}
