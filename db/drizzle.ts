import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const createDb = () => {
  try {
    const url = process.env.DATABASE_URL;

    if (!url || url.includes("<")) return undefined;

    const client = postgres(url);
    return drizzle(client, { schema });
  } catch {
    return undefined;
  }
};

const db = createDb();

export default db!;
