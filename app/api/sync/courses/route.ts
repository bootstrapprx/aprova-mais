import { NextResponse } from "next/server";
import { getSyncUser, jsonError } from "@/lib/sync-auth";
import { db } from "@/db/drizzle";
import { courses, units, lessons, challenges, challengeOptions } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(req: Request) {
  const user = await getSyncUser(req);
  if (!user) return jsonError("Unauthorized");

  const allCourses = await db.query.courses.findMany({
    where: eq(courses.active, true),
    with: {
      units: {
        orderBy: [asc(units.order)],
        with: {
          lessons: {
            orderBy: [asc(lessons.order)],
            with: {
              challenges: {
                orderBy: [asc(challenges.order)],
                with: {
                  challengeOptions: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(allCourses);
}
