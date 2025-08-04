import { Habit, HabitLog } from "@prisma/client";

export type HabitWithLogs = Habit & {
  logs: HabitLog[];
};