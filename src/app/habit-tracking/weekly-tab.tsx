"use client";

import { Habit, HabitLog, DayOfWeek } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { updateHabitLog } from "@/actions/habit-tracking";
import { startOfWeek, format, addDays, isSameDay } from "date-fns";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

interface WeeklyTabProps {
  habits: (Habit & { logs: HabitLog[] })[];
  userId: string;
}

export default function WeeklyTab({ habits, userId }: WeeklyTabProps) {
  const weekStart = startOfWeek(new Date());
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleCheckboxChange = async (
    habitId: string,
    date: Date,
    completed: boolean
  ) => {
    await updateHabitLog({
      habitId,
      userId,
      date,
      completed,
    });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-8 gap-1">
        <div className="font-medium p-2">Habit</div>
        {daysOfWeek.map((day, index) => (
          <div key={day} className="font-medium p-2 text-center text-sm">
            {day.slice(0, 3)}
          </div>
        ))}
      </div>

      {habits.map((habit) => {
        // Check if habit is only for specific days
        const isSpecificDays = habit.frequencyType === "SPECIFIC_DAYS";
        const specificDays = habit.specificDays || [];

        return (
          <div key={habit.id} className="grid grid-cols-8 gap-1 items-center">
            <div className="p-2">
              <h3 className="font-medium">{habit.title}</h3>
              {habit.description && (
                <p className="text-sm text-gray-500">{habit.description}</p>
              )}
            </div>

            {weekDates.map((date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const dayLog = habit.logs.find(
                (log) => format(log.date, "yyyy-MM-dd") === dateStr
              );
              const isCompleted = dayLog?.completed ?? false;

              // Check if this day is applicable for the habit
              const isApplicable =
                !isSpecificDays ||
                specificDays.includes(
                  format(date, "EEEE").toUpperCase() as DayOfWeek
                );

              return (
                <div key={dateStr} className="flex justify-center">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(habit.id, date, checked as boolean)
                    }
                    disabled={!isApplicable}
                    className={`h-5 w-5 ${
                      !isApplicable ? "opacity-50" : ""
                    }`}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}