"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";

/* UI Components */
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type SignUpData = z.infer<typeof signUpSchema>;

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function SignUp() {
  const router = useRouter();

  const [emailCheck, setEmailCheck] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const MOODBOARD = "/mnt/data/A_compilation_of_ten_casino_games_with_professiona.png";

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

  /* Email check */
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
        if (!ignore) setEmailMessage(e.response?.data?.message || "Email check failed");
      } finally {
        if (!ignore) setCheckingEmail(false);
      }
    };

    fetchCheck();
    return () => {
      ignore = true;
    };
  }, [emailCheck]);

  const onSubmit = async (data: SignUpData) => {
    if (!window.grecaptcha) {
      toast.error("reCAPTCHA unavailable");
      return;
    }

    setSubmitting(true);

    try {
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: "signup" }
      );

      const res = await axios.post("/api/sign-up", {
        ...data,
        recaptchaToken: token,
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-900 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-[0_10px_32px_rgba(0,0,0,0.08)] border border-gray-200">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img src={MOODBOARD} alt="brand" className="w-12 h-12 rounded-md object-cover" />
          <div>
            <p className="text-sm text-gray-500">Create Account</p>
            <h1 className="text-xl font-semibold">Sign up to get started</h1>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Full name */}
            <FormField
              name="fullName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your username" className="bg-gray-50 border border-gray-300 px-4 py-6 rounded-xl focus:ring-2 focus:ring-blue-300"/>
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
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="you@example.com"
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                        className="bg-gray-50 border border-gray-300 px-4 py-6 rounded-xl pr-10 focus:ring-2 focus:ring-blue-300"
                      />
                      {checkingEmail && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 animate-spin" />
                      )}
                    </div>
                  </FormControl>

                  {emailCheck && (
                    <p className={`text-sm mt-1 ${emailMessage === "Email is unique" ? "text-green-600" : "text-red-500"}`}>
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
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 px-4 py-6 rounded-xl pr-16 focus:ring-2 focus:ring-blue-300"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-600 text-sm">
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
                  <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type={showPassword ? "text" : "password"} placeholder="••••••••" className="bg-gray-50 border border-gray-300 px-4 py-6 rounded-xl focus:ring-2 focus:ring-blue-300"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button type="submit" disabled={submitting} className="w-full py-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-bold rounded-xl hover:scale-[1.02] transition shadow-md">
              {submitting ? <><Loader2 className="animate-spin w-4 h-4 mr-2 inline" /> Creating account...</> : "Sign Up"}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
