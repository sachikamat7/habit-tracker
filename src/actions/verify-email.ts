'use server';

import  db  from "@/lib/db";

export async function verifyEmail(token: string, email: string,) {
  try {
    //check if user is already verified
    console.log("Verifying email with token:", token, "and email:", email);
    const existingUser = await db.user.findFirst({
      where: { email , emailVerified: { not: null } },
    });
    if (existingUser) {
        console.log("User already verified:", existingUser.email);
      return { error: "User already verified" };
    }
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

    // Find and verify user
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
        emailVerified: new Date(),
        email: verificationToken.email,
      },
    });

    // Clean up token
    await db.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { success: "Account verified successfully! Please sign in." };

  } catch (error) {
    console.error("Verification error:", error);
    return { error: "An unexpected error occurred" };
  }
}