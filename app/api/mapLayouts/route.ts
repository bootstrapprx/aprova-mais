import { NextResponse } from "next/server";
import { getIsAdmin } from "@/lib/admin";
import { parseQuery, sendResponse } from "@/lib/api-helpers";
import fs from "fs";
import path from "path";

const LAYOUTS_DIR = path.join(process.cwd(), "data", "map_layouts");

function ensureDir() {
  if (!fs.existsSync(LAYOUTS_DIR)) {
    fs.mkdirSync(LAYOUTS_DIR, { recursive: true });
  }
}

function getAllLayouts() {
  ensureDir();
  const files = fs.readdirSync(LAYOUTS_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const courseId = file.replace(".json", "");
    const data = JSON.parse(fs.readFileSync(path.join(LAYOUTS_DIR, file), "utf-8"));
    return { id: parseInt(courseId, 10), courseId: parseInt(courseId, 10), ...data };
  });
}

export async function GET(req: Request) {
  if (!(await getIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const layouts = getAllLayouts();
  const { filter, sort, order, offset, limit } = parseQuery(req);

  let filtered = layouts;

  if (filter?.q) {
    const q = String(filter.q).toLowerCase();
    filtered = filtered.filter((l) => String(l.courseId).includes(q));
  }

  const total = filtered.length;
  const sliced = filtered.slice(offset, offset + limit);

  return sendResponse(sliced, total, offset);
}

export async function POST(req: Request) {
  if (!(await getIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { courseId, ...layoutData } = body;

  if (!courseId) {
    return NextResponse.json({ error: "courseId required" }, { status: 400 });
  }

  ensureDir();
  const filePath = path.join(LAYOUTS_DIR, `${courseId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(layoutData, null, 2));

  return NextResponse.json({ id: courseId, courseId, ...layoutData }, { status: 201 });
}
