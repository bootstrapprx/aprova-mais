import { NextResponse } from "next/server";
import { getSyncUser, jsonError } from "@/lib/sync-auth";
import { db } from "@/db/drizzle";
import { challengeProgress, userProgress } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function GET(req: Request) {
  const user = await getSyncUser(req);
  if (!user) return jsonError("Unauthorized");

  const progress = await db.query.challengeProgress.findMany({
    where: eq(challengeProgress.userId, user.userId),
  });

  const userData = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, user.userId),
  });

  return NextResponse.json({
    userId: user.userId,
    xp: userData?.points ?? 0,
    completedChallenges: progress
      .filter((p) => p.completed)
      .map((p) => p.challengeId),
    activeCourseId: userData?.activeCourseId ?? null,
  });
}

export async function POST(req: Request) {
  const user = await getSyncUser(req);
  if (!user) return jsonError("Unauthorized");

  const body = await req.json();
  const { challengeId, completed } = body;

  if (typeof challengeId !== "number" || typeof completed !== "boolean") {
    return NextResponse.json(
      { error: "challengeId (number) and completed (boolean) required" },
      { status: 400 }
    );
  }

  await db
    .insert(challengeProgress)
    .values({
      userId: user.userId,
      challengeId,
      completed,
    })
    .onConflictDoUpdate({
      target: [challengeProgress.userId, challengeProgress.challengeId],
      set: { completed },
    });

  if (completed) {
    await db
      .update(userProgress)
      .set({ points: sql`${userProgress.points} + 10` })
      .where(eq(userProgress.userId, user.userId));
  }

  return NextResponse.json({ ok: true });
}
