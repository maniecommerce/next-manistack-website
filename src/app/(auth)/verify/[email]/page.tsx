"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

const verifySchema = z.object({
  code: z.string().length(6, "Enter 6-digit OTP"),
});

type FormValues = z.infer<typeof verifySchema>;

export default function OTPVerifyProGUI() {
  const router = useRouter();
  const params = useParams<{ email: string }>();
  const email = decodeURIComponent(params?.email ?? "");

  const { control } = useForm<FormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  // OTP state
  const length = 6;
  const [values, setValues] = useState<string[]>(
    Array.from({ length }, () => "")
  );
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Status & messages
  const [status, setStatus] = useState<
    "idle" | "sent" | "verifying" | "verified" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  // Resend / cooldown
  const [resendCount, setResendCount] = useState(0);
  const [cooldown, setCooldown] = useState<number>(0);
  const cooldownRef = useRef<number | null>(null);
  const maxResend = 5;

  // Loading
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const MOODBOARD =
    "/mnt/data/A_compilation_of_ten_casino_games_with_professiona.png";

  useEffect(() => {
    triggerSend();
    return () => {
      if (cooldownRef.current) window.clearInterval(cooldownRef.current);
    };
  }, []);

  useEffect(() => {
    if (cooldown <= 0 && cooldownRef.current) {
      window.clearInterval(cooldownRef.current);
      cooldownRef.current = null;
    }
  }, [cooldown]);

  function startCooldown(seconds: number) {
    setCooldown(seconds);
    if (cooldownRef.current) window.clearInterval(cooldownRef.current);
    cooldownRef.current = window.setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
  }

  async function triggerSend() {
    if (resendCount >= maxResend) {
      setMessage("Maximum resend attempts reached");
      return;
    }
    setLoadingSend(true);
    try {
      if (!window.grecaptcha) {
        toast.error("reCAPTCHA not loaded. Try again later.");
        return;
      }

    
      setResendCount((c) => c + 1);
      const backoff = Math.min(300, 30 * Math.pow(2, resendCount));
      startCooldown(backoff);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoadingSend(false);
    }
  }

  function focusIndex(i: number) {
    const node = inputsRef.current[i];
    if (node) node.focus();
  }

  function handleChange(ch: string, idx: number) {
    if (!/^\d?$/.test(ch)) return;
    setValues((v) => {
      const copy = [...v];
      copy[idx] = ch;
      return copy;
    });
    if (ch && idx < length - 1) focusIndex(idx + 1);
    if (!ch && idx > 0) focusIndex(idx - 1);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusIndex(Math.max(0, idx - 1));
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusIndex(Math.min(length - 1, idx + 1));
    }
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      e.preventDefault();
      focusIndex(idx - 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").trim();
    const digits = text.replace(/\D/g, "");
    const arr = Array.from({ length }, (_, i) => digits[i] || "");
    setValues(arr);
    const firstEmpty = arr.findIndex((c) => !c);
    focusIndex(firstEmpty === -1 ? length - 1 : firstEmpty);
  }

 async function handleVerify() {
  const code = values.join("");

  if (code.length !== length) {
    setMessage("Enter full 6-digit code");
    return;
  }

  if (!window.grecaptcha) {
    toast.error("reCAPTCHA not loaded");
    return;
  }

  setLoadingVerify(true);

  try {
    // 🔥 Generate recaptcha token
    const recaptchaToken = await window.grecaptcha.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
      { action: "verify" }
    );

    // 🔥 Now send it to backend
    const res = await axios.post("/api/otp-verify", {
      email,
      code,
      recaptchaToken,
    });

    toast.success(res.data.message || "Verified");
    router.replace("/sign-in");
  } catch (err: any) {
    setStatus("error");
    setMessage(err?.response?.data?.message || "Invalid code");
  } finally {
    setLoadingVerify(false);
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#031427] to-[#061827] flex items-start justify-center py-12 px-4 text-white">
      <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl">
        <div className="bg-white/6 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={MOODBOARD}
                className="w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 object-cover rounded-md"
              />
              <div>
                <div className="text-sm sm:text-base text-gray-300">
                  Verify your email
                </div>
                <div className="font-semibold text-lg sm:text-xl lg:text-2xl">
                  {email}
                </div>
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-400 mt-2 lg:mt-0">
              Secure • OTP expires in 5 min
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div>
              <div className="text-sm sm:text-base text-gray-300 mb-2">
                Enter verification code
              </div>
              <div
                className="flex flex-wrap gap-2 lg:gap-3"
                onPaste={handlePaste}
              >
                {values.map((val, i) => (
                  <input
                    key={i}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={val}
                    ref={(el) => {
                      inputsRef.current[i] = el;
                    }}
                    onChange={(e) =>
                      handleChange(e.target.value.replace(/\D/g, ""), i)
                    }
                    onKeyDown={(e) => handleKey(e, i)}
                    className="w-10 sm:w-12 lg:w-16 h-12 sm:h-14 lg:h-16 text-center text-lg sm:text-xl lg:text-2xl rounded-xl bg-black/20 border border-white/6 focus:border-teal-300 focus:ring-2 focus:ring-teal-400 outline-none"
                  />
                ))}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="mt-4 flex flex-nowrap gap-2 items-center overflow-x-auto">
                  <button
                    onClick={triggerSend}
                    disabled={loadingSend || cooldown > 0}
                    className="flex-shrink-0 px-4 py-2 rounded-lg border border-white/10 text-white disabled:opacity-50"
                  >
                    {loadingSend
                      ? "Sending..."
                      : cooldown > 0
                        ? `Resend in ${cooldown}s`
                        : "Resend Email"}
                  </button>
                  <button
                    onClick={handleVerify}
                    disabled={loadingVerify}
                    className="flex-shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-300 to-cyan-300 text-[#042322] font-semibold disabled:opacity-50"
                  >
                    {loadingVerify ? "Verifying..." : "Verify"}
                  </button>
                </div>

                <div className="text-sm text-gray-400 ml-auto mt-2 sm:mt-0">
                  Resent {resendCount}/{maxResend}
                </div>
              </div>

              {message && (
                <div
                  className={`mt-3 text-sm ${status === "error" ? "text-rose-300" : "text-green-200"}`}
                >
                  {message}
                </div>
              )}
            </div>

            <div>
              <div className="text-sm sm:text-base text-gray-300">
                Help & Security
              </div>
              <div className="mt-3 text-sm sm:text-base text-gray-400 space-y-2">
                <p>
                  If you did not receive the email, check your spam folder or
                  try resending after the cooldown.
                </p>
                <p>
                  Your OTP is valid for 5 minutes. Do not share with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs sm:text-sm text-gray-400">
          Need other verification methods? Contact support or use SMS
          verification.
        </div>
      </div>
    </div>
  );
}
