import { getHabitsWithLogs } from "@/actions/habit-tracking";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const habits = await getHabitsWithLogs(session.user.id);
  return NextResponse.json(habits);
}