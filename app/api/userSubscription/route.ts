import { type NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.userSubscription.findMany();
  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof userSubscription.$inferSelect;
  const data = await db.insert(userSubscription).values({ ...body }).returning();
  return NextResponse.json(data[0]);
};
