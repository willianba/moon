import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";
import { monotonicFactory } from "ulid";

export const ulid = monotonicFactory();

export const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
};
