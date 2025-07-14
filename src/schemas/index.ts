//validation schemas for the application on frontend as well as backend
import { z } from 'zod';

export const FrequencyType = z.enum(["DAILY", "ALTERNATE_DAYS", "SPECIFIC_DAYS", "INTERVAL_DAYS"]);
export type FrequencyType = z.infer<typeof FrequencyType>;

export const DayOfWeek = z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]);
export type DayOfWeek = z.infer<typeof DayOfWeek>;

export const PeriodType = z.enum(["DAY", "WEEK", "MONTH"]);
export type PeriodType = z.infer<typeof PeriodType>;

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

export const HabitSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  frequencyType: FrequencyType,
  specificDays: z.array(DayOfWeek).optional(),
  intervalDays: z.number().int().min(1).max(365).optional(),
  includeInStreaks: z.boolean().default(true).optional(),
  durationCount: z.number().int().min(1).optional(),
  durationPeriod: PeriodType.optional(),
  durationNumber: z.number().int().min(1).optional(),
  isActive: z.boolean().default(true).optional(),
});
