import { zValidator } from "@hono/zod-validator";
import { db, eq, users } from "@moon/database";
import {
  createUserSchema,
  idParamSchema,
  updateUserSchema,
} from "@moon/shared";
import { Hono } from "hono";

export const usersRoute = new Hono()
  .get("/", async (c) => {
    const allUsers = await db.select().from(users);
    return c.json({ success: true, data: allUsers });
  })
  .get("/:id", zValidator("param", idParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    return c.json({ success: true, data: user });
  })
  .post("/", zValidator("json", createUserSchema), async (c) => {
    const data = c.req.valid("json");
    const [user] = await db.insert(users).values(data).returning();

    return c.json({ success: true, data: user }, 201);
  })
  .patch(
    "/:id",
    zValidator("param", idParamSchema),
    zValidator("json", updateUserSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");

      const [user] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();

      if (!user) {
        return c.json({ success: false, error: "User not found" }, 404);
      }

      return c.json({ success: true, data: user });
    }
  )
  .delete("/:id", zValidator("param", idParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const [user] = await db.delete(users).where(eq(users.id, id)).returning();

    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    return c.json({ success: true, data: user });
  });
