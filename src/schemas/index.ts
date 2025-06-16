//validation schemas for the application on frontend as well as backend
import { z } from 'zod';

export const SigninSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string().min(1, { message: "Password is required" })
  });

export const SignupSchema = z
  .object({
    name: z.string().min(2, { message: "Minimum two characters*" }).max(50, { message: "Name cannot exceed 50 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(3, { message: "Minimum three characters*" }).max(50),
    confirmPassword: z.string().min(3, { message: "Minimum three characters*" }).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export  const ResetPasswordEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(3, { message: "Minimum three characters*" }).max(50),
    confirmPassword: z.string().min(3, { message: "Minimum three characters*" }).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });