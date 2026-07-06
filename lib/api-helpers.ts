import { NextRequest, NextResponse } from "next/server";

export type ParsedQuery = {
  filter: Record<string, unknown>;
  search: string;
  sort: string;
  order: "asc" | "desc";
  offset: number;
  limit: number;
};

export function parseQuery(req: NextRequest): ParsedQuery {
  const { searchParams } = new URL(req.url);

  let filter: Record<string, unknown> = {};
  try {
    const raw = searchParams.get("filter");
    if (raw) filter = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    filter = {};
  }

  const search = searchParams.get("q") || "";

  const sort = searchParams.get("sort") || "id";
  const order = (searchParams.get("order") || "ASC") as "asc" | "desc";

  let offset = 0;
  let limit = 100;
  const range = searchParams.get("range");
  if (range) {
    try {
      const parsed = JSON.parse(range) as [number, number];
      offset = parsed[0];
      limit = parsed[1] - parsed[0] + 1;
    } catch {
      offset = 0;
      limit = 100;
    }
  }

  return { filter, search, sort, order, offset, limit };
}

export function sendResponse<T>(data: T[], total: number, rangeStart = 0) {
  const end = rangeStart + data.length - 1;
  return NextResponse.json(data, {
    headers: {
      "Content-Range": `items ${rangeStart}-${end}/${total}`,
      "Access-Control-Expose-Headers": "Content-Range",
    },
  });
}
