import { NextResponse } from "next/server";
import { getSyncUser, jsonError } from "@/lib/sync-auth";
import { db } from "@/db/drizzle";
import { units, lessons } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

interface Room {
  id: string;
  name: string;
  type: string;
  unitIndex: number;
  lessonIndex: number;
}

interface Floor {
  level: number;
  name: string;
  rooms: Room[];
}

interface Building {
  id: string;
  name: string;
  position: [number, number, number];
  floors: Floor[];
}

interface MapLayout {
  courseId: number;
  world: {
    type: string;
    theme: string;
    groundSize: [number, number];
  };
  buildings: Building[];
  connections: unknown[];
  decorations: unknown[];
}

function buildDefaultLayout(courseId: number, courseUnits: Array<{
  id: number;
  title: string;
  lessons: Array<{ id: number; title: string }>;
}>): MapLayout {
  const rooms: Room[] = [];
  let lessonIdx = 0;

  courseUnits.forEach((unit, unitIdx) => {
    unit.lessons.forEach((lesson) => {
      rooms.push({
        id: `room_${unitIdx}_${lessonIdx}`,
        name: lesson.title,
        type: "challenge",
        unitIndex: unitIdx,
        lessonIndex: lessonIdx,
      });
      lessonIdx++;
    });
  });

  const floorsPerBuilding = 4;
  const floors: Floor[] = [];

  for (let f = 0; f < Math.ceil(rooms.length / floorsPerBuilding); f++) {
    const floorRooms = rooms.slice(f * floorsPerBuilding, (f + 1) * floorsPerBuilding);
    floors.push({
      level: f + 1,
      name: f === 0 ? "Térreo" : `Andar ${f}`,
      rooms: floorRooms,
    });
  }

  return {
    courseId,
    world: {
      type: "building_board",
      theme: "default",
      groundSize: [50, 50],
    },
    buildings: [
      {
        id: "main",
        name: "Prédio Principal",
        position: [0, 0, 0],
        floors,
      },
    ],
    connections: [],
    decorations: [],
  };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const user = await getSyncUser(req);
  if (!user) return jsonError("Unauthorized");

  const { courseId: courseIdStr } = await params;
  const courseId = parseInt(courseIdStr, 10);
  if (isNaN(courseId)) {
    return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
  }

  const courseUnits = await db.query.units.findMany({
    where: eq(units.courseId, courseId),
    orderBy: [asc(units.order)],
    with: {
      lessons: {
        orderBy: [asc(lessons.order)],
        columns: { id: true, title: true },
      },
    },
  });

  const layout = buildDefaultLayout(courseId, courseUnits);
  return NextResponse.json(layout);
}
