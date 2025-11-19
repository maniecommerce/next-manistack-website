import axios from "axios";

export async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!token) return false;
    if (!secretKey) return false;

    const verifyRes = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      `secret=${secretKey}&response=${token}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return verifyRes.data.success === true;
  } catch (error) {
    console.error("reCAPTCHA Error:", error);
    return false;
  }
}