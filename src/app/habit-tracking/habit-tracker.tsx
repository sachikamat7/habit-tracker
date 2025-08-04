"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TodayTab from "./today-tab";
import WeeklyTab from "./weekly-tab";
import OverallTab from "./overall-tab";
import { Habit, HabitLog, DayOfWeek } from "@prisma/client";

interface HabitTrackerProps {
  habits: (Habit & { logs: HabitLog[] })[];
  userId: string;
}

export default function HabitTracker({ habits, userId }: HabitTrackerProps) {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="overall">Overall</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <TodayTab habits={habits} userId={userId} />
        </TabsContent>

        <TabsContent value="weekly">
          <WeeklyTab habits={habits} userId={userId} />
        </TabsContent>

        <TabsContent value="overall">
          <OverallTab habits={habits} userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}