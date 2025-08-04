"use client";

import { HabitForm } from "@/components/habit-form";
import { useSession } from "next-auth/react";
import HabitTracker from "../habit-tracking/habit-tracker";
import { useEffect, useState } from "react";
import { HabitWithLogs } from "@/types";

export default function Dashboard() {
  const { data: session } = useSession();
  const [habits, setHabits] = useState<HabitWithLogs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabits = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/habits?userId=${session.user.id}`);
          const data = await response.json();
          setHabits(data);
        } catch (error) {
          console.error("Error fetching habits:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHabits();
  }, [session]);

  return (
    <div className="w-full h-screen p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-5 gap-6 h-[70vh]">
        {/* Habit Tracker - 40% width (2/5 columns) */}
        <div className="col-span-2  rounded-lg shadow p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              Loading habits...
            </div>
          ) : (
            <HabitTracker habits={habits} userId={session?.user?.id || ""} />
          )}
        </div>
        
        {/* Edit Habit - 20% width (1/5 columns) */}
        <div className="col-span-1  rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Edit Habit</h2>
          <HabitForm />
        </div>
        
        {/* Empty Space - 40% width (2/5 columns) */}
        <div className="col-span-2 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Analytics</h2>
          <p className="text-gray-500">Your habit analytics will appear here</p>
        </div>
      </div>
    </div>
  );
}