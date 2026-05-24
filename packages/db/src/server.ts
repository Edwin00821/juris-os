import { env } from "@juris-os/env/api-gateway";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const conn = postgres(env.DATABASE_URL);

export const db = drizzle(conn, { schema });
