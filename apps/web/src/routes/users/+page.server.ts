import { db, eq, users } from "@moon/database";
import { createUserSchema, idParamSchema } from "@moon/shared";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const allUsers = await db.select().from(users);
  return { users: allUsers };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const payload = createUserSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
    });

    if (!payload.success) {
      return fail(400, {
        error: payload.error.issues[0]?.message ?? "Invalid input",
      });
    }

    // TODO validate duplicates
    await db.insert(users).values(payload.data);
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const parsed = idParamSchema.safeParse({ id: formData.get("id") });

    if (!parsed.success) {
      return fail(400, { error: "Invalid user id" });
    }

    const [user] = await db
      .delete(users)
      .where(eq(users.id, parsed.data.id))
      .returning();

    if (!user) {
      return fail(404, { error: "User not found" });
    }
  },
};
