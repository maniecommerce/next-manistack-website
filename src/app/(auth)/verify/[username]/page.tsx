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
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(0);
  const [cooldown, setCooldown] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success(response.data.message);
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Invalid or expired code, try again."
      );
    }
  };

  const handleResend = async () => {
    if (cooldown) return;

    setResending(true);

    try {
      const res = await axios.post("/api/resend-code", {
        username: params.username,
      });

      toast.success(res.data.message);

      if (res.data.remaining === 0) {
        // No resend attempts remaining → 40 min cooldown
        setCooldown(true);
        setTimer(2400);
        return;
      }

      // Normal resend (1st or 2nd time)
      setTimer(60);
    } catch (error: any) {
      if (error.response?.data?.cooldown) {
        toast.error(error.response.data.message);
        setCooldown(true);
        setTimer(2400);
      } else {
        toast.error("Failed to resend OTP");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f2f2f2] px-4">
      <div className="w-full max-w-sm bg-white border border-[#d5d9d9] rounded-lg px-6 py-8 shadow shadow-[#0000001a]">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Enter OTP</h1>
        <p className="text-sm text-gray-700 mb-6">
          We've sent a verification code to your email.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Verification Code
                  </FormLabel>

                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full flex justify-center"
                  >
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

            <Button
              type="submit"
              className="w-full bg-[#f7ca00] hover:bg-[#e6b800] text-black font-medium border border-[#a88734] rounded-md"
            >
              Verify
            </Button>

            <p className="text-xs text-gray-600 text-center">
              Didn't receive the code?{" "}
              <button
                type="button"
                disabled={timer > 0 || resending || cooldown}
                onClick={handleResend}
                className="text-blue-600 hover:underline disabled:text-gray-400"
              >
                {cooldown
  ? `Try again in ${Math.floor(timer / 60)}m ${timer % 60}s`
  : timer > 0
  ? `Resend in ${Math.floor(timer / 60)}m ${timer % 60}s`
  : "Resend"}

              </button>
            </p>

            <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-2">
              🔒 Secure verification
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
