"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";
import { SignupSchema } from "@/schemas";
import  db  from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const signup = async(values: z.infer<typeof SignupSchema>) => {
    console.log("Signup action called with values:", values);
    const validatedFields = SignupSchema.safeParse(values);

    if(!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error);
        // return { error: validatedFields.error };
        return { error:"Invalid fields" };
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    //check if user already exists in the database
    const existingUser = await getUserByEmail(email);

    if(existingUser) {
        console.error("User already exists with email:", email);
        return { error: "Email already in use" };
    }

    //create a new user in the database
    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail({
    email,
    token: verificationToken.token,
  });
    console.log("Verification token sent to email:", email);
    return { success: "Confirmation email sent!" };
}