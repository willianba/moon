import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps, ulid } from "../shared";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(ulid),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  ...timestamps,
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
