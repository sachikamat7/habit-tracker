"use client";

import { Habit, HabitLog } from "@prisma/client";
import { format, startOfMonth, endOfMonth, isSameDay, addDays, getDay } from "date-fns";
import { updateHabitLog } from "@/actions/habit-tracking"; // Adjust the import path as needed

interface OverallTabProps {
  habits: (Habit & { logs: HabitLog[] })[];
  userId: string;
}

export default function OverallTab({ habits, userId }: OverallTabProps) {
  const currentDate = new Date();
  const currentMonth = format(currentDate, "MMMM yyyy");
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Alternative to eachDayOfInterval for older date-fns versions
  const daysInMonth: Date[] = [];
  let currentDay = monthStart;
  while (currentDay <= monthEnd) {
    daysInMonth.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  const handleDayClick = async (habitId: string, date: Date) => {
    const existingLog = habits
      .find((h) => h.id === habitId)
      ?.logs.find((log) => isSameDay(log.date, date));

    await updateHabitLog({
      habitId,
      userId,
      date,
      completed: !existingLog?.completed,
    });
  };

  return (
    <div className="space-y-6 mt-4">
      {habits.map((habit) => {
        return (
          <div key={habit.id} className="border rounded-lg p-4">
            <div className="mb-4">
              <h3 className="font-medium">{habit.title}</h3>
              {habit.description && (
                <p className="text-sm text-gray-500">{habit.description}</p>
              )}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium">
                  {day}
                </div>
              ))}

              {Array.from({ length: getDay(monthStart) }).map((_, index) => (
                <div key={`empty-start-${index}`} className="h-8" />
              ))}

              {daysInMonth.map((day) => {
                const dayStr = format(day, "yyyy-MM-dd");
                const isCompleted = habit.logs.some(
                  (log) => format(log.date, "yyyy-MM-dd") === dayStr && log.completed
                );
                const isFuture = day > currentDate;

                return (
                  <button
                    key={dayStr}
                    onClick={() => !isFuture && handleDayClick(habit.id, day)}
                    disabled={isFuture}
                    className={`h-8 rounded-md flex items-center justify-center text-sm ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isFuture
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}