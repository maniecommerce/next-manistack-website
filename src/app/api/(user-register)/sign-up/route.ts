import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // If username exists and isVerified -> block
    const existingVerified = await UserModel.findOne({ username, isVerified: true });
    if (existingVerified) {
      return NextResponse.json({ success: false, message: "Username is already taken" }, { status: 400 });
    }

    const existingByEmail = await UserModel.findOne({ email });

    // create hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate plain OTP to send and then store hashed
    const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingByEmail) {
      if (existingByEmail.isVerified) {
        return NextResponse.json({ success: false, message: "User already exists with this email" }, { status: 400 });
      }
      // update existing unverified user
      existingByEmail.username = username;
      existingByEmail.password = hashedPassword;
      await existingByEmail.setOTP(plainOtp);
      // send email
      const emailResp = await sendVerificationEmail(email, username, plainOtp);
      if (!emailResp.success) {
        return NextResponse.json({ success: false, message: emailResp.message || "Failed to send email" }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Updated user, OTP sent" }, { status: 200 });
    }

    // create fresh user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      isAcceptingMessages: true,
      messages: [],
      userWallet: 0,
    });

    await newUser.save();
    await newUser.setOTP(plainOtp);

    const emailResp = await sendVerificationEmail(email, username, plainOtp);
    if (!emailResp.success) {
      return NextResponse.json({ success: false, message: emailResp.message || "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "User created, OTP sent" }, { status: 201 });
  } catch (err) {
    console.error("signup error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
