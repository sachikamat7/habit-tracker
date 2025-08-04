"use server";

import  db  from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateHabitLog({
  habitId,
  userId,
  date,
  completed,
}: {
  habitId: string;
  userId: string;
  date: Date;
  completed: boolean;
}) {
  // Check if log already exists
  const existingLog = await db.habitLog.findFirst({
    where: {
      habitId,
      userId,
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  if (existingLog) {
    // Update existing log
    await db.habitLog.update({
      where: { id: existingLog.id },
      data: { completed },
    });
  } else {
    // Create new log
    await db.habitLog.create({
      data: {
        habitId,
        userId,
        date,
        completed,
      },
    });
  }

  revalidatePath("/"); // Adjust path as needed
}

export async function getHabitsWithLogs(userId: string) {
  return await db.habit.findMany({
    where: { userId },
    include: { logs: true },
    orderBy: { position: "asc" },
  });
}