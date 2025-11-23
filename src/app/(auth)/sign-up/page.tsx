

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";

import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";

/* ===== shadcn components ===== */
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
/* ============================== */


type SignUpData = z.infer<typeof signUpSchema>;
/* -------------------------------- */

export default function SignUp() {
  const router = useRouter();

  const [emailCheck, setEmailCheck] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const MOODBOARD = "/mnt/data/A_compilation_of_ten_casino_games_with_professiona.png";

  /* React Hook Form */
  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const debounced = useDebounceCallback((v: string) => setEmailCheck(v), 500);

  /* ---------- Email Uniqueness Check ---------- */
  useEffect(() => {
    let ignore = false;

    const fetchCheck = async () => {
      if (!emailCheck) {
        setEmailMessage("");
        return;
      }

      setCheckingEmail(true);
      setEmailMessage("");

      try {
        const res = await axios.get(`/api/check-email-unique?email=${emailCheck}`);
        if (!ignore) setEmailMessage(res.data.message);
      } catch (err) {
        const e = err as AxiosError<{ message?: string }>;
        if (!ignore) {
          setEmailMessage(e.response?.data?.message || "Email check failed");
        }
      } finally {
        if (!ignore) setCheckingEmail(false);
      }
    };

    fetchCheck();
    return () => {
      ignore = true;
    };
  }, [emailCheck]);

  /* ---------- Submit ---------- */
  const onSubmit = async (data: SignUpData) => {
    if (!captchaToken) {
      toast.error("Please complete the captcha ❗");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post("/api/sign-up", {
        ...data,
        recaptchaToken: captchaToken,
      });

      toast.success(res.data.message || "Account created successfully!");
      router.push(`/verify/${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#031427] to-[#061827] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img src={MOODBOARD} alt="brand" className="w-12 h-12 rounded-md object-cover" />
          <div>
            <div className="text-sm text-gray-300">Create Account</div>
            <div className="text-xl font-semibold">Sign up to get started</div>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Username */}
            <FormField
              name="fullName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your username"
                      className="bg-black/20 border border-white/10 px-4 py-6 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="you@example.com"
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                        className="bg-black/20 border border-white/10 px-4 py-6 rounded-xl pr-10"
                      />
                      {checkingEmail && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 animate-spin" />
                      )}
                    </div>
                  </FormControl>

                  {emailCheck && (
                    <p
                      className={`text-sm mt-1 ${emailMessage === "Email is unique"
                          ? "text-green-300"
                          : "text-rose-300"
                        }`}
                    >
                      {emailMessage}
                    </p>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300 mb-1 block">
                    Password
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full px-4 py-6 rounded-xl bg-black/20 border border-white/10 
                       focus:border-teal-300 focus:ring-2 focus:ring-teal-400 outline-none pr-16"
                      />

                      {/* TEXT BUTTON (Show / Hide) */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 
                       text-gray-300 text-sm font-medium"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Confirm Password */}
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-black/20 border border-white/10 px-4 py-6 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={(t) => setCaptchaToken(t)}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full py-6 bg-gradient-to-r from-teal-300 to-cyan-300 text-[#042322] text-lg rounded-xl font-bold"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2 inline" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-teal-300 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
