"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";
import { ResetPasswordSchema } from "@/schemas";
import  db  from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const resetPassword = async(values: z.infer<typeof ResetPasswordSchema>, token: string, email: string) => {
   try{
     const validatedFields = ResetPasswordSchema.safeParse(values);

    if(!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error);
        // return { error: validatedFields.error };
        return { error:"Invalid fields" };
    }

    const { password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return { error: "Invalid token" };
    }

    // Check expiration
    if (new Date(verificationToken.expires) < new Date()) {
      await db.verificationToken.delete({
        where: { id: verificationToken.id },
      });
      return { error: "Token expired" };
    }

    const user = await db.user.findUnique({
      where: { email: verificationToken.email },
    });

    if (!user) {
      return { error: "User not found" };
    }
    // Update user
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });
    // Clean up token
    await db.verificationToken.delete({
      where: { id: verificationToken.id },
    });

     return { success: "Password reset successfully!" };
   }catch (error) {
     console.error("Reset password error:", error);
     return { error: "An unexpected error occurred" };
   }
}