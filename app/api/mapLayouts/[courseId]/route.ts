import { NextResponse } from "next/server";
import { getIsAdmin } from "@/lib/admin";
import fs from "fs";
import path from "path";

const LAYOUTS_DIR = path.join(process.cwd(), "data", "map_layouts");

function ensureDir() {
  if (!fs.existsSync(LAYOUTS_DIR)) {
    fs.mkdirSync(LAYOUTS_DIR, { recursive: true });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  if (!(await getIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId } = await params;
  const filePath = path.join(LAYOUTS_DIR, `${courseId}.json`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ id: parseInt(courseId, 10), courseId: parseInt(courseId, 10), buildings: [] });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return NextResponse.json({ id: parseInt(courseId, 10), courseId: parseInt(courseId, 10), ...data });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  if (!(await getIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId } = await params;
  const body = await req.json();
  const { courseId: _id, ...layoutData } = body;

  ensureDir();
  const filePath = path.join(LAYOUTS_DIR, `${courseId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(layoutData, null, 2));

  return NextResponse.json({ id: parseInt(courseId, 10), courseId: parseInt(courseId, 10), ...layoutData });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  if (!(await getIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId } = await params;
  const filePath = path.join(LAYOUTS_DIR, `${courseId}.json`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return NextResponse.json({ ok: true });
}
