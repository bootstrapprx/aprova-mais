"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { getServerUserId } from "@/lib/supabase-server";

export const upsertChallengeProgress = async (challengeId: number) => {
  try {
    const userId = await getServerUserId();
    if (!userId) return { error: "Unauthorized." };

    const challenge = await db.query.challenges.findFirst({
      where: eq(challenges.id, challengeId),
    });

    if (!challenge) return { error: "Challenge not found." };

    const lessonId = challenge.lessonId;

    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
      where: and(
        eq(challengeProgress.userId, userId),
        eq(challengeProgress.challengeId, challengeId)
      ),
    });

    const isPractice = !!existingChallengeProgress;

    if (isPractice) {
      await db.transaction(async (tx) => {
        await tx
          .update(challengeProgress)
          .set({ completed: true })
          .where(eq(challengeProgress.id, existingChallengeProgress.id));

        await tx
          .update(userProgress)
          .set({
            points: sql`${userProgress.points} + 10`,
          })
          .where(eq(userProgress.userId, userId));
      });
    } else {
      await db.transaction(async (tx) => {
        await tx.insert(challengeProgress).values({
          challengeId,
          userId,
          completed: true,
        });

        await tx
          .update(userProgress)
          .set({
            points: sql`${userProgress.points} + 10`,
          })
          .where(eq(userProgress.userId, userId));
      });
    }

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);

    return { success: true };
  } catch (error) {
    console.error("[upsertChallengeProgress]", error);
    return { error: "Algo deu errado. Tente novamente." };
  }
};
