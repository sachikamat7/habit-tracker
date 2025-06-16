"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";

export const sendResetPasswordEmail = async (values: { email: string }, verification: boolean) => {
    const { email } = values;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Email not found!" };
    }

    if (verification) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail({
            email,
            token: verificationToken.token,
        });
        console.log("Verification token sent to email from login:", existingUser.email);
        return { success: "Confirmation email sent!" }
    }

    const userVerfied = await db.user.findFirst({
        where: { email, emailVerified: null },
    });

    if (userVerfied) {
        return { error: "Please verify your email before resetting password!" };
    }

    try {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendPasswordResetEmail({
            email,
            token: verificationToken.token,
        });

        return { success: "Reset password email sent!" };
    } catch (error) {
        return { error: "Something went wrong!" };
    }
};