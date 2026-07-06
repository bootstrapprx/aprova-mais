import { type NextRequest, NextResponse } from "next/server";
import { and, asc, desc, eq, ilike, or, count, type SQL } from "drizzle-orm";

import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { parseQuery, sendResponse } from "@/lib/api-helpers";

const buildOrderBy = (sort: string, dir: "asc" | "desc") => {
  const d = dir === "desc" ? desc : asc;
  switch (sort) {
    case "title": return d(lessons.title);
    case "order": return d(lessons.order);
    case "unitId": return d(lessons.unitId);
    default: return d(lessons.id);
  }
};

const buildWhere = (filter: Record<string, unknown>): SQL | undefined => {
  const c: SQL[] = [];

  if (filter.unitId) c.push(eq(lessons.unitId, Number(filter.unitId)));
  const q = (filter.q as string) || "";
  if (q) {
    c.push(ilike(lessons.title, `%${q}%`) as SQL);
  }

  return c.length ? and(...c) : undefined;
};

export const GET = async (req: NextRequest) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const { filter, sort, order, offset, limit } = parseQuery(req);
  const where = buildWhere(filter);

  const data = await db.query.lessons.findMany({
    where,
    orderBy: buildOrderBy(sort, order),
    offset,
    limit,
  });

  const [totalResult] = await db.select({ value: count() }).from(lessons).where(where);
  const total = Number(totalResult?.value ?? 0);

  return sendResponse(data, total, offset);
};


export const POST = async (req: NextRequest) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof lessons.$inferSelect;

  const data = await db
    .insert(lessons)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
