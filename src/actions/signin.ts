"use server";

import * as z from "zod";
import { SigninSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";

export const signin = async (values: z.infer<typeof SigninSchema>) => {
    console.log("Signin action called with values:", values);
    const validatedFields = SigninSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error("Validation failed:", validatedFields.error);
        // return { error: validatedFields.error };
        return { error: "Invalid fields" };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
        return { error: "Email not found" };
    }
    if (!existingUser.password) {
        return { error: "Email already in use with different provider!" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

              await sendVerificationEmail({
            email,
            token: verificationToken.token,
          });
        console.log("Verification token sent to email from login:", existingUser.email);
        return { success: "Confirmation email sent!"}
    }


    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error; // rethrow if it's not an AuthError
        //otherwise it will not redirect
    }
}