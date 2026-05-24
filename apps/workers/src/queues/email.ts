import { Queue } from "bullmq";
import { connection } from "../connection";

// Email queue for sending emails
export const emailQueue = new Queue("email", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 1000,
  },
});

// Types for email jobs
export interface SendEmailJob {
  body: string;
  subject: string;
  to: string;
}
