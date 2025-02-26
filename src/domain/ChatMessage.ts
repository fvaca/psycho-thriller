import { z } from "npm:zod";


const contentPart = z.object({
    type: z.literal("text"),
    text: z.string(),
  });

// Define Zod schema for a chat message
export const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.array(contentPart),
});

// Infer TypeScript type from Zod schema
export type ChatMessage = z.infer<typeof messageSchema>;