// actions/habit.ts
"use server";

import { HabitSchema } from "@/schemas";
import  db  from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createHabit = async (values: z.infer<typeof HabitSchema>) => {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const validatedFields = HabitSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const {
        title,
        description,
        frequencyType,
        specificDays,
        intervalDays,
        includeInStreaks,
        durationCount,
        durationPeriod,
        durationNumber,
    } = validatedFields.data;

    try {
        // Calculate expiration date if duration is provided
        let expirationDate: Date | null = null;
        if (durationNumber && durationPeriod) {
            expirationDate = new Date();
            switch (durationPeriod) {
                case "DAY":
                    expirationDate.setDate(expirationDate.getDate() + durationNumber);
                    break;
                case "WEEK":
                    expirationDate.setDate(expirationDate.getDate() + durationNumber * 7);
                    break;
                case "MONTH":
                    expirationDate.setMonth(expirationDate.getMonth() + durationNumber);
                    break;
            }
        }

        await db.habit.create({
            data: {
                title,
                description,
                frequencyType,
                specificDays: frequencyType === "SPECIFIC_DAYS" ? specificDays : undefined,
                intervalDays: frequencyType === "INTERVAL_DAYS" ? intervalDays : undefined,
                includeInStreaks,
                durationCount,
                durationPeriod,
                durationNumber,
                expirationDate,
                userId: session.user.id,
            },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error creating habit:", error);
        return { error: "Failed to create habit" };
    }
};