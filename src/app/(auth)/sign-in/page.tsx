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

/* UI Components */
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* Casino Image */
const MOODBOARD =
  "/mnt/data/A_compilation_of_ten_casino_games_with_professiona.png";

export default function LoginProUI() {
  const router = useRouter();

  /* Password Show-Hide */
  const [showPass, setShowPass] = useState(false);

  /* Separate states for password + identifier (optional, but you asked for show/hide style input) */
  const [password, setPassword] = useState("");

  /* React Hook Form */
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  /* Handle Login */
  const onSubmit = async () => {
    const data = {
      identifier: form.getValues("identifier"),
      password: password,
    };

    const result = await signIn("credentials", {
      redirect: false,
      ...data,
    });

    if (result?.error) {
      toast.error("Incorrect email or password ❌");
      return;
    }

    toast.success("Login successful 🎉");
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#031427] to-[#061827] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img src={MOODBOARD} alt="brand" className="w-12 h-12 rounded-md object-cover" />
          <div>
            <div className="text-sm text-gray-300">Welcome Back</div>
            <div className="text-xl font-semibold">Login to your account</div>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* Identifier */}
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email or Username</FormLabel>
                  <Input
                    {...field}
                    placeholder="you@example.com"
                    className="bg-black/20 border border-white/10 px-4 py-6 rounded-xl"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password (your custom show/hide component) */}
            <div className="mb-4">
              <label className="text-sm text-gray-300 mb-1 block">Password</label>

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    form.setValue("password", e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 
                             focus:border-teal-300 focus:ring-2 focus:ring-teal-400 outline-none
                             text-white placeholder-gray-400"
                  placeholder="••••••••"
                />

                {/* Show / Hide Button */}
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                             text-gray-300 hover:text-teal-300 text-sm transition"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
           
              </div>
                   <div className="text-left text-gray-400 text-sm mt-1 hover:text-teal-300 cursor-pointer">
          Forgot password?
        </div>
            </div>
             {/* Forgot */}
        

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-6 bg-gradient-to-r from-teal-300 to-cyan-300 text-[#042322] text-lg rounded-xl font-bold"
            >
              Login
            </Button>
          </form>
        </Form>

     {/* Signup Button */}
    <div className="text-center mt-6 text-gray-400 text-sm">
          Create a new account?{" "}
          <Link href="/sign-up" className="text-teal-300 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
