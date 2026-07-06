import { type NextRequest, NextResponse } from "next/server";
import { and, asc, desc, eq, ilike, or, count, type SQL } from "drizzle-orm";

import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { parseQuery, sendResponse } from "@/lib/api-helpers";

const buildOrderBy = (sort: string, dir: "asc" | "desc") => {
  const d = dir === "desc" ? desc : asc;
  switch (sort) {
    case "userName": return d(userProgress.userName);
    case "points": return d(userProgress.points);
    case "activeCourseId": return d(userProgress.activeCourseId);
    default: return d(userProgress.userId);
  }
};

const buildWhere = (filter: Record<string, unknown>): SQL | undefined => {
  const c: SQL[] = [];

  if (filter.activeCourseId) c.push(eq(userProgress.activeCourseId, Number(filter.activeCourseId)));
  const q = (filter.q as string) || "";
  if (q) {
    c.push(ilike(userProgress.userName, `%${q}%`) as SQL);
  }

  return c.length ? and(...c) : undefined;
};

export const GET = async (req: NextRequest) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const { filter, sort, order, offset, limit } = parseQuery(req);
  const where = buildWhere(filter);

  const data = await db.query.userProgress.findMany({
    where,
    orderBy: buildOrderBy(sort, order),
    offset,
    limit,
  });

  const [totalResult] = await db.select({ value: count() }).from(userProgress).where(where);
  const total = Number(totalResult?.value ?? 0);

  return sendResponse(data, total, offset);
};


export const POST = async (req: NextRequest) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof userProgress.$inferSelect;

  const data = await db
    .insert(userProgress)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
