import { type NextRequest, NextResponse } from "next/server";
import { and, asc, desc, eq, ilike, or, count, type SQL } from "drizzle-orm";

import db from "@/db/drizzle";
import { challengeProgress } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { parseQuery, sendResponse } from "@/lib/api-helpers";

const buildOrderBy = (sort: string, dir: "asc" | "desc") => {
  const d = dir === "desc" ? desc : asc;
  switch (sort) {
    case "userId": return d(challengeProgress.userId);
    case "challengeId": return d(challengeProgress.challengeId);
    case "completed": return d(challengeProgress.completed);
    default: return d(challengeProgress.id);
  }
};

const buildWhere = (filter: Record<string, unknown>): SQL | undefined => {
  const c: SQL[] = [];

  if (filter.userId) c.push(eq(challengeProgress.userId, filter.userId as string));
  if (filter.challengeId) c.push(eq(challengeProgress.challengeId, Number(filter.challengeId)));
  if (filter.completed !== undefined) c.push(eq(challengeProgress.completed, filter.completed === "true" || filter.completed === true));

  return c.length ? and(...c) : undefined;
};

export const GET = async (req: NextRequest) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const { filter, sort, order, offset, limit } = parseQuery(req);
  const where = buildWhere(filter);

  const data = await db.query.challengeProgress.findMany({
    where,
    orderBy: buildOrderBy(sort, order),
    offset,
    limit,
  });

  const [totalResult] = await db.select({ value: count() }).from(challengeProgress).where(where);
  const total = Number(totalResult?.value ?? 0);

  return sendResponse(data, total, offset);
};


export const POST = async (req: NextRequest) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof challengeProgress.$inferSelect;

  const data = await db
    .insert(challengeProgress)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
