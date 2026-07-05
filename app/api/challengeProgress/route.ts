import { type NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { challengeProgress } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.challengeProgress.findMany();
  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof challengeProgress.$inferSelect;
  const data = await db.insert(challengeProgress).values({ ...body }).returning();
  return NextResponse.json(data[0]);
};
