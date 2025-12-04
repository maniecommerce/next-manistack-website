"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { signInSchema } from "@/schemas/signInSchema";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOODBOARD = "/mnt/data/A_compilation_of_ten_casino_games_with_professiona.png";

export default function LoginProUI() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    const data = {
      identifier: form.getValues("identifier"),
      password: password,
    };

    const result = await signIn("credentials", { redirect: false, ...data });

    if (result?.error) {
      toast.error("Incorrect email or password ❌");
      return;
    }

    toast.success("Login successful 🎉");
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-200">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img src={MOODBOARD} alt="brand" className="w-12 h-12 rounded-md object-cover" />
          <div>
            <div className="text-sm text-gray-500">Welcome Back</div>
            <div className="text-xl font-semibold text-gray-900">Login to your account</div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* Identifier */}
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email or Username</FormLabel>
                  <Input
                    {...field}
                    placeholder="you@example.com"
                    className="bg-gray-50 border border-gray-300 px-4 py-6 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    form.setValue("password", e.target.value);
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition text-sm"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              <div className="text-left text-gray-500 text-sm mt-1 hover:text-blue-600 cursor-pointer">
                Forgot password?
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg rounded-xl font-bold shadow-lg hover:scale-[1.02] transition"
            >
              Login
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          Create a new account?{" "}
          <Link href="/sign-up" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
