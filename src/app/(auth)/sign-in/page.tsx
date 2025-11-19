"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInSchema } from "@/schemas/signInSchema";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast.error("Incorrect email or password");
    }

    if (result?.url) {
      router.replace("/");
      toast.success("Signed in successfully");
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEDED] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border rounded-md shadow-sm p-6">
        <div className="flex justify-center mb-6">
          <img src="./e_commerce.svg" alt="amazon logo" className="h-9 bg-whiate" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Sign-In</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email or Mobile Number</FormLabel>
                  <Input {...field} className="rounded-sm border-gray-400" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-sm font-medium">Password</FormLabel>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    className="rounded-sm border-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 bottom-2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full rounded-sm bg-[#F7CA00] hover:bg-[#e2b600] text-black font-medium" type="submit">
              Continue
            </Button>
          </form>
        </Form>

        <div className="text-xs text-blue-600 hover:underline mt-3 cursor-pointer">Forgot password?</div>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-2 text-xs text-gray-500">New to Manistack?</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <Link href="/sign-up">
          <Button className="w-full rounded-sm bg-gray-200 text-black hover:bg-gray-300 text-sm py-2">
            Create your Manistack account
          </Button>
        </Link>
      </div>
    </div>
  );
}
