"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type FormValues = z.infer<typeof verifySchema>;

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const identifier = params?.username ?? "";

  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(0); // seconds
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null); // timestamp ms

  const form = useForm<FormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (!identifier) return;
    // optional: store identifier to localStorage to autofill email on reload
    window.localStorage.setItem("signup_identifier", identifier);
  }, [identifier]);

  // countdown
  useEffect(() => {
    if (timer <= 0) return;
    const iv = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(iv);
  }, [timer]);

  // cooldown countdown UI
  useEffect(() => {
    if (!cooldownUntil) return;
    const iv = setInterval(() => {
      if (!cooldownUntil) return;
      if (Date.now() > cooldownUntil) {
        setCooldownUntil(null);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [cooldownUntil]);

  async function onSubmit(data: FormValues) {
    try {
      const res = await axios.post("/api/otp-verify", {
        username: identifier,
        code: data.code,
      });
      toast.success(res.data.message || "Verified");
      router.replace("/sign-in");
    } catch (err: any) {
      const d = err?.response?.data;
      if (d?.cooldown && d?.cooldownMinutes) {
        setCooldownUntil(Date.now() + d.cooldownMinutes * 60 * 1000);
      }
      toast.error(d?.message || "Invalid or expired code");
    }
  }

  async function handleResend() {
    if (cooldownUntil || timer > 0 || resending) return;
    setResending(true);
    try {
      const res = await axios.post("/api/resend-otp", {
        username: identifier,
      });
      toast.success(res.data.message || "OTP resent");
      // start short resend wait (60s)
      setTimer(60);
    } catch (err: any) {
      const d = err?.response?.data;
      if (d?.cooldown && d?.cooldownMinutes) {
        setCooldownUntil(Date.now() + d.cooldownMinutes * 60 * 1000);
        toast.error(d.message);
      } else {
        toast.error(d?.message || "Failed to resend OTP");
      }
    } finally {
      setResending(false);
    }
  }

  const cooldownText = cooldownUntil ? (() => {
    const diff = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${m}m ${s}s`;
  })() : null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f7f7f8] px-4">
      <div className="w-full max-w-md bg-white border rounded-lg px-8 py-10 shadow">
        <h1 className="text-2xl font-semibold mb-2">Verify your account</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter the 6-digit code we sent to <strong>{identifier}</strong>. The
          code expires in <strong>15 minutes</strong>.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Verify
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || timer > 0 || !!cooldownUntil}
                className="text-blue-600 hover:underline disabled:text-gray-400"
              >
                {cooldownUntil
                  ? `Try again in ${cooldownText}`
                  : timer > 0
                  ? `Resend in ${Math.floor(timer / 60)}m ${timer % 60}s`
                  : "Resend code"}
              </button>

              <div className="text-xs text-muted-foreground">🔒 Secure</div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
