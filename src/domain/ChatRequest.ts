import { z } from "npm:zod";
import { messageSchema } from "./ChatMessage.ts";

// Define Zod schema for a chat request
export const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1, "At least one message is required"),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
});

// Infer TypeScript type from Zod schema
export type ChatRequest = z.infer<typeof chatRequestSchema>;