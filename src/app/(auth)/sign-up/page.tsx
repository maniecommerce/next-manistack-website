"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

import { signUpSchema } from "@/schemas/signUpSchema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function SignUp() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
  if (!captchaToken) {
    toast.error("Please verify you are not a robot ❗");
    return;
  }

  setIsSubmitting(true);

  try {
    const res = await axios.post("/api/sign-up", {
      ...data,
      recaptchaToken: captchaToken,
    });

    toast.success(res.data.message);
    router.push(`/verify/${data.username}`);

  } catch (err: any) {
    toast.error(err.response?.data?.message || "Sign-up failed ❗");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#fafafa] py-6 px-4">
      <div className="w-full max-w-sm border border-gray-300 bg-white rounded-md p-6 shadow-sm">
        {/* Logo */}
         {/* <div className="flex justify-center mb-6">
          <img src="./e_commerce.svg" alt="amazon logo" className="h-9 bg-whiate" />
        </div> */}

        <h2 className="text-xl font-semibold mb-4">Create account</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your name</FormLabel>
                  <Input {...field} className="rounded-sm border-gray-400 pr-10 h-10 " />
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
                  <FormLabel>Email</FormLabel>
                  <Input {...field} className="rounded-sm border-gray-400 pr-10 h-10 " />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-sm font-medium">Password</FormLabel>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    className="rounded-sm  pr-10 border-gray-400  h-10 "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 bottom-2.5 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <FormMessage />
                </FormItem>
              )}
            />

            Recaptcha
            <div className="flex justify-center ">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-[#ffca28] hover:bg-[#fbbf24] text-black font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" /> Creating account…
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-xs text-gray-600 mt-4">
          By creating an account, you agree to our Conditions of Use & Privacy Notice.
        </p>

        <div className="border-t my-4"></div>

        <Link href="/sign-in" className="block">
          <Button className="w-full bg-gray-200 hover:bg-gray-300 text-black">
            Already have an account? Sign in
          </Button>
        </Link>
      </div>
    </div>
  );
}