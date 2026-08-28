import { NextResponse } from "next/server";
import { getIsAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  if (!(await getIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { courseId, courseName, units } = body;

  if (!courseId || !courseName || !units?.length) {
    return NextResponse.json(
      { error: "courseId, courseName, and units required" },
      { status: 400 }
    );
  }

  const odooUrl = process.env.ODOO_INTERNAL_URL || "http://backend:8069";
  const prompt = `You are a game level designer for a Brazilian exam study platform.

Generate a 3D map layout JSON for this course:

**Course**: ${courseName} (ID: ${courseId})
**Units and Lessons**:
${units.map((u: { name: string; lessons: { name: string }[] }, i: number) =>
  `Unit ${i + 1}: ${u.name}
${u.lessons.map((l, j) => `  Lesson ${j + 1}: ${l.name}`).join("\n")}`
).join("\n\n")}

Generate a JSON object with this EXACT structure (no markdown, no code fences, just raw JSON):
{
  "world": {
    "type": "building_board",
    "theme": "default",
    "groundSize": [80, 80],
    "skyColor": [0.5, 0.7, 0.9]
  },
  "buildings": [
    {
      "id": "building_1",
      "name": "Unit Name",
      "position": [x, 0, z],
      "floors": [
        {
          "level": 0,
          "name": "Floor Name",
          "rooms": [
            {
              "id": "lesson_unique_id",
              "name": "Lesson Name",
              "type": "lesson",
              "unitIndex": 0,
              "lessonIndex": 0,
              "position": [x, y, z]
            }
          ]
        }
      ]
    }
  ],
  "decorations": [
    {
      "type": "tree",
      "position": [x, 0, z],
      "scale": 1.0
    }
  ]
}

Rules:
- Position units as separate buildings spread across the ground
- Lessons are rooms inside each building's floors
- Add 5-10 decorative trees/objects around the world
- Position buildings at least 20 units apart
- Ground is centered at 0,0 with the given groundSize
- Only return the JSON, nothing else`;

  try {
    const response = await fetch(`${odooUrl}/kodoo_ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AprovaMais-BFF/1.0",
      },
      credentials: "include",
      body: JSON.stringify({
        mode: "chat",
        prompt,
        assistant_key: "default",
        name: `Map Generator - ${courseName}`,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: "AI Center request failed", details: text },
        { status: 502 }
      );
    }

    const data = await response.json();
    const responseText = data?.chat?.response_text || data?.result?.response_text || "";

    let layout;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        layout = JSON.parse(jsonMatch[0]);
      } else {
        layout = JSON.parse(responseText);
      }
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: responseText },
        { status: 500 }
      );
    }

    return NextResponse.json({
      courseId,
      ...layout,
      generated: true,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reach AI Center", details: String(error) },
      { status: 502 }
    );
  }
}
