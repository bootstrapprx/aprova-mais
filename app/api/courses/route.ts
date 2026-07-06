import { type NextRequest, NextResponse } from "next/server";
import { and, asc, desc, eq, ilike, or, count, type SQL } from "drizzle-orm";

import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { parseQuery, sendResponse } from "@/lib/api-helpers";

const buildOrderBy = (sort: string, dir: "asc" | "desc") => {
  const d = dir === "desc" ? desc : asc;
  switch (sort) {
    case "title": return d(courses.title);
    case "banca": return d(courses.banca);
    case "orgao": return d(courses.orgao);
    case "ano": return d(courses.ano);
    case "active": return d(courses.active);
    default: return d(courses.id);
  }
};

const buildWhere = (filter: Record<string, unknown>): SQL | undefined => {
  const c: SQL[] = [];

  if (filter.banca) c.push(eq(courses.banca, filter.banca as string));
  if (filter.orgao) c.push(eq(courses.orgao, filter.orgao as string));
  if (filter.ano) c.push(eq(courses.ano, Number(filter.ano)));
  if (filter.active !== undefined) c.push(eq(courses.active, filter.active === "true" || filter.active === true));
  const q = (filter.q as string) || "";
  if (q) {
    c.push(or(
      ilike(courses.title, `%${q}%`),
      ilike(courses.description, `%${q}%`),
    ) as SQL);
  }

  return c.length ? and(...c) : undefined;
};

export const GET = async (req: NextRequest) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const { filter, sort, order, offset, limit } = parseQuery(req);
  const where = buildWhere(filter);

  const data = await db.query.courses.findMany({
    where,
    orderBy: buildOrderBy(sort, order),
    offset,
    limit,
  });

  const [totalResult] = await db.select({ value: count() }).from(courses).where(where);
  const total = Number(totalResult?.value ?? 0);

  return sendResponse(data, total, offset);
};


export const POST = async (req: NextRequest) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof courses.$inferSelect;

  const data = await db
    .insert(courses)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
