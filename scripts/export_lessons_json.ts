import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";
import fs from "fs";
import path from "path";

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function exportCourses() {
  console.log("Fetching courses with full nesting...");
  const courses = await db.query.courses.findMany({
    where: schema.courses.active,
    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
            with: {
              challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                  challengeOptions: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const outDir = path.join(__dirname, "../godot-app/data");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, "courses.json");
  fs.writeFileSync(outFile, JSON.stringify(courses, null, 2));
  console.log(`Exported ${courses.length} courses to ${outFile}`);
  process.exit(0);
}

exportCourses().catch((e) => {
  console.error(e);
  process.exit(1);
});
