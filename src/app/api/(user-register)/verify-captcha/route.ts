import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const res = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    { method: "POST" }
  );

  const data = await res.json();

  if (data.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false });
  }
}
