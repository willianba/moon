import { emailQueue } from "@moon/workers/queues";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
  const jobId = params.id;

  if (!jobId) {
    return json({ success: false, error: "Invalid job id" }, { status: 400 });
  }

  const job = await emailQueue.getJob(jobId);

  if (!job) {
    return json({ success: false, error: "Job not found" }, { status: 404 });
  }

  const state = await job.getState();

  return json({
    success: true,
    data: {
      data: job.data,
      failedReason: job.failedReason,
      id: job.id,
      name: job.name,
      returnvalue: job.returnvalue,
      state,
    },
  });
};
