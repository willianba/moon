import { type Job, Worker } from "bullmq";
import { createConnection } from "../connection";
import type { SendEmailJob } from "../queues/email";

const connection = createConnection();

export const emailWorker = new Worker<SendEmailJob>(
  "email",
  async (job: Job<SendEmailJob>) => {
    const { to, subject, body } = job.data;

    // TODO: Implement actual email sending logic
    console.log(`[Email Worker] Sending email to ${to}`);
    console.log(`[Email Worker] Subject: ${subject}`);
    console.log(`[Email Worker] Body: ${body}`);

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 100));

    return { sent: true, to };
  },
  {
    connection,
    concurrency: 5,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`[Email Worker] Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`[Email Worker] Job ${job?.id} failed:`, err.message);
});
