import { z } from "@moon/shared";
import { emailQueue } from "@moon/workers/queues";
import { json, type RequestHandler } from "@sveltejs/kit";

const sendEmailSchema = z.object({
  body: z.string().min(1),
  subject: z.string().min(1),
  to: z.string().email(),
});

export const POST: RequestHandler = async ({ request }) => {
  const payload = sendEmailSchema.safeParse(await request.json());

  if (!payload.success) {
    return json(
      {
        success: false,
        error: payload.error.issues[0]?.message ?? "Invalid request body",
      },
      { status: 400 }
    );
  }

  const job = await emailQueue.add("send-email", payload.data);

  return json(
    {
      success: true,
      data: {
        data: job.data,
        jobId: job.id,
        name: job.name,
      },
    },
    { status: 201 }
  );
};
