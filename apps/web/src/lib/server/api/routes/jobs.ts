import { zValidator } from "@hono/zod-validator";
import { z } from "@moon/shared";
import { emailQueue } from "@moon/workers/queues";
import { Hono } from "hono";

const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export const jobsRoute = new Hono()
  // POST /api/jobs/email - Queue an email job
  .post("/email", zValidator("json", sendEmailSchema), async (c) => {
    const data = c.req.valid("json");

    const job = await emailQueue.add("send-email", data);

    return c.json(
      {
        success: true,
        data: {
          jobId: job.id,
          name: job.name,
          data: job.data,
        },
      },
      201
    );
  })

  // GET /api/jobs/email/:id - Get job status
  .get("/email/:id", async (c) => {
    const jobId = c.req.param("id");
    const job = await emailQueue.getJob(jobId);

    if (!job) {
      return c.json({ success: false, error: "Job not found" }, 404);
    }

    const state = await job.getState();

    return c.json({
      success: true,
      data: {
        id: job.id,
        name: job.name,
        data: job.data,
        state,
        returnvalue: job.returnvalue,
        failedReason: job.failedReason,
      },
    });
  });
