// /src/app/api/otp-verify/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

type ReqBody = {
  username?: string;
  email?: string;
  code?: string;
};

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body: ReqBody = await request.json();
    const identifier = (body.username || body.email || "").trim();
    const code = (body.code || "").trim();

    if (!identifier || !code) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

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
        { success: false, message: "Already verified" },
        { status: 400 }
      );
    }

    // 🔥 Runs OTP verification logic (expiry, wrong-attempts, cooldown)
    const res = await user.verifyOTP(code);

    if (res.ok) {
      return NextResponse.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    }

    // ❌ OTP Expired
    if (res.reason === "expired") {
      return NextResponse.json(
        { success: false, message: "OTP expired. Request a new code." },
        { status: 400 }
      );
    }

    // 🔒 Too many wrong attempts → Cooldown active
    if (res.reason === "locked") {
      const minutesLeft = user.otpCooldownExpiry
        ? Math.ceil(
            (user.otpCooldownExpiry.getTime() - Date.now()) / 60000
          )
        : 45;

      return NextResponse.json(
        {
          success: false,
          message: `Too many wrong attempts. Try again in ${minutesLeft} minutes.`,
          cooldown: true,
          cooldownMinutes: minutesLeft,
        },
        { status: 429 }
      );
    }

    // ❌ Invalid Code
    if (res.reason === "invalid") {
      return NextResponse.json(
        { success: false, message: "Invalid code. Please try again." },
        { status: 400 }
      );
    }

    // ❌ No OTP Found
    if (res.reason === "no_otp") {
      return NextResponse.json(
        { success: false, message: "No OTP found. Request a code first." },
        { status: 400 }
      );
    }

    // Fallback
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 400 }
    );
  } catch (err) {
    console.error("verify error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
