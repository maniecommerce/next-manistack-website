import { z } from 'zod';

export const usernameValidation = z
  .string()
  .min(2, 'Username must be at least 2 characters')
  .max(20, 'Username must be no more than 20 characters')
 .regex(
    /^[A-Za-z]+(?: [A-Za-z]+)*$/,
    "Username can contain letters and single spaces between words. No numbers or special characters. No leading/trailing spaces."
  );

export const emailValidation = z
 .string()
  .min(2, 'Username must be at least 2 characters')
  .max(20, 'Username must be no more than 20 characters')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address");

export const signUpSchema = z.object({
  fullName: usernameValidation,
  email: emailValidation,
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
       confirmPassword: z.string().min(6, "Minimum 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});




