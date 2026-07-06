import { type NextRequest, NextResponse } from "next/server";
import { and, asc, desc, eq, ilike, or, count, type SQL } from "drizzle-orm";

import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { parseQuery, sendResponse } from "@/lib/api-helpers";

const buildOrderBy = (sort: string, dir: "asc" | "desc") => {
  const d = dir === "desc" ? desc : asc;
  switch (sort) {
    case "text": return d(challengeOptions.text);
    case "correct": return d(challengeOptions.correct);
    case "challengeId": return d(challengeOptions.challengeId);
    default: return d(challengeOptions.id);
  }
};

const buildWhere = (filter: Record<string, unknown>): SQL | undefined => {
  const c: SQL[] = [];

  if (filter.challengeId) c.push(eq(challengeOptions.challengeId, Number(filter.challengeId)));
  if (filter.correct !== undefined) c.push(eq(challengeOptions.correct, filter.correct === "true" || filter.correct === true));
  const q = (filter.q as string) || "";
  if (q) {
    c.push(ilike(challengeOptions.text, `%${q}%`) as SQL);
  }

  return c.length ? and(...c) : undefined;
};

export const GET = async (req: NextRequest) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const { filter, sort, order, offset, limit } = parseQuery(req);
  const where = buildWhere(filter);

  const data = await db.query.challengeOptions.findMany({
    where,
    orderBy: buildOrderBy(sort, order),
    offset,
    limit,
  });

  const [totalResult] = await db.select({ value: count() }).from(challengeOptions).where(where);
  const total = Number(totalResult?.value ?? 0);

  return sendResponse(data, total, offset);
};


export const POST = async (req: NextRequest) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof challengeOptions.$inferSelect;

  const data = await db
    .insert(challengeOptions)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
