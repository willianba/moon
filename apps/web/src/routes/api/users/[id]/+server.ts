import { db, eq, users } from "@moon/database";
import { idParamSchema, updateUserSchema } from "@moon/shared";
import { json, type RequestHandler } from "@sveltejs/kit";

const invalidIdResponse = () =>
  json({ success: false, error: "Invalid user id" }, { status: 400 });

export const GET: RequestHandler = async ({ params }) => {
  const parsedParams = idParamSchema.safeParse(params);

  if (!parsedParams.success) {
    return invalidIdResponse();
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parsedParams.data.id));

  if (!user) {
    return json({ success: false, error: "User not found" }, { status: 404 });
  }

  return json({ success: true, data: user });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
  const parsedParams = idParamSchema.safeParse(params);

  if (!parsedParams.success) {
    return invalidIdResponse();
  }

  const payload = updateUserSchema.safeParse(await request.json());

  if (!payload.success) {
    return json(
      {
        success: false,
        error: payload.error.issues[0]?.message ?? "Invalid request body",
      },
      { status: 400 }
    );
  }

  const [user] = await db
    .update(users)
    .set(payload.data)
    .where(eq(users.id, parsedParams.data.id))
    .returning();

  if (!user) {
    return json({ success: false, error: "User not found" }, { status: 404 });
  }

  return json({ success: true, data: user });
};

export const DELETE: RequestHandler = async ({ params }) => {
  const parsedParams = idParamSchema.safeParse(params);

  if (!parsedParams.success) {
    return invalidIdResponse();
  }

  const [user] = await db
    .delete(users)
    .where(eq(users.id, parsedParams.data.id))
    .returning();

  if (!user) {
    return json({ success: false, error: "User not found" }, { status: 404 });
  }

  return json({ success: true, data: user });
};
