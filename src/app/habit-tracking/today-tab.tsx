"use client";

import { Habit, HabitLog } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { updateHabitLog } from "@/actions/habit-tracking";
import { startOfToday, format } from "date-fns";

interface TodayTabProps {
  habits: (Habit & { logs: HabitLog[] })[];
  userId: string;
}

export default function TodayTab({ habits, userId }: TodayTabProps) {
  const today = startOfToday();
  const todayStr = format(today, "yyyy-MM-dd");

  const handleCheckboxChange = async (habitId: string, completed: boolean) => {
    await updateHabitLog({
      habitId,
      userId,
      date: today,
      completed,
    });
  };

  return (
    <div className="space-y-4 mt-4">
      {habits.map((habit) => {
        const todayLog = habit.logs.find(
          (log) => format(log.date, "yyyy-MM-dd") === todayStr
        );
        const isCompleted = todayLog?.completed ?? false;

        return (
          <div
            key={habit.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{habit.title}</h3>
              {habit.description && (
                <p className="text-sm text-gray-500">{habit.description}</p>
              )}
            </div>
            <Checkbox
              checked={isCompleted}
              onCheckedChange={(checked) =>
                handleCheckboxChange(habit.id, checked as boolean)
              }
              className="h-6 w-6"
            />
          </div>
        );
      })}
    </div>
  );
}