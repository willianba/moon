import { db, users } from "@moon/database";
import { createUserSchema } from "@moon/shared";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  const allUsers = await db.select().from(users);

  return json({ success: true, data: allUsers });
};

export const POST: RequestHandler = async ({ request }) => {
  const payload = createUserSchema.safeParse(await request.json());

  if (!payload.success) {
    return json(
      {
        success: false,
        error: payload.error.issues[0]?.message ?? "Invalid request body",
      },
      { status: 400 }
    );
  }

  const [user] = await db.insert(users).values(payload.data).returning();

  return json({ success: true, data: user }, { status: 201 });
};
