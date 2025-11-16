import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// Max resend allowed before cooldown
const MAX_RESEND = 3;

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email } = await request.json();
    const identifier = (username || email || "").trim();

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: "Username or Email is required" },
        { status: 400 }
      );
    }

    // User find
    const user = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "User already verified" },
        { status: 400 }
      );
    }

    // ----------------------------
    // 1️⃣ COOLDOWN CHECK (45 minutes)
    // ----------------------------
    if (user.otpCooldownExpiry && new Date() < user.otpCooldownExpiry) {
      const minutesLeft = Math.ceil(
        (user.otpCooldownExpiry.getTime() - Date.now()) / 60000
      );

      return NextResponse.json(
        {
          success: false,
          message: `Too many attempts. Try again after ${minutesLeft} minutes.`,
          cooldown: true,
        },
        { status: 429 }
      );
    }

    // ---------------------------------
    // 2️⃣ RESEND LIMIT CHECK (3 Times)
    // ---------------------------------
    if (!user.resendCount) user.resendCount = 0;

    if (user.resendCount >= MAX_RESEND) {
      // 45 min cooldown
      user.otpCooldownExpiry = new Date(Date.now() + 45 * 60 * 1000);
      user.resendCount = 0;
      await user.save();

      return NextResponse.json(
        {
          success: false,
          message: `Resent too many times. Try again later.`,
          cooldown: true,
        },
        { status: 429 }
      );
    }

    // ---------------------------------------------
    // 3️⃣ Generate new OTP + save & reset attempts
    // ---------------------------------------------
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();

    await user.setOTP(newOTP); // hash + expiry 15m + reset attempts

    // Increase resend count
    user.resendCount++;
    await user.save();

    // --------------------------
    // 4️⃣ SEND EMAIL
    // --------------------------
    const resp = await sendVerificationEmail(user.email, user.username, newOTP);

    if (!resp.success) {
      return NextResponse.json(
        { success: false, message: resp.message || "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "OTP resent successfully",
        remaining: MAX_RESEND - user.resendCount,
        cooldown: false,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
