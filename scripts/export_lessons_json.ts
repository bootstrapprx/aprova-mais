import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";
import fs from "fs";
import path from "path";

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function exportLessons() {
  console.log("Fetching courses and lessons...");
  const courses = await db.query.courses.findMany({
    with: {
      units: {
        with: {
          lessons: {
            with: {
              challenges: {
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

  const outFile = path.join(outDir, "lessons.json");
  fs.writeFileSync(outFile, JSON.stringify(courses, null, 2));
  console.log(`Exported lessons to ${outFile}`);
  process.exit(0);
}

exportLessons().catch((e) => {
  console.error(e);
  process.exit(1);
});
