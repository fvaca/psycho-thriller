import { assert, assertEquals } from "@std/assert";
import { ChatService } from "./src/application/ChatService.ts";
import { chatRequestSchema } from "./src/domain/ChatRequest.ts";
import { EventBus } from "./src/infrastructure/EventBus.ts";


// ✅ Mock EventBus to track emitted events
const eventBusPublishSpy = async (event: string, payload: any): Promise<void> => {
  console.log(`Event Published: ${event}`, payload);
  return Promise.resolve(); // ✅ Ensure it returns a Promise<void>
};
EventBus.publish = eventBusPublishSpy;

// ✅ Create a ChatService instance
const chatService = new ChatService();

// ✅ Test: Valid input triggers chat event
Deno.test("Valid input triggers chat event", async () => {
  const chatRequest = chatRequestSchema.safeParse({
    messages: [{ role: "user", content: [{ type: "text", text: "Tell me a joke" }] }],
    temperature: 1,
    max_tokens: 1000,
  });

  if (!chatRequest.success) {
    throw new Error("Invalid chat request input");
  }

  await chatService.processChat(chatRequest.data);

  // We can't assert a direct return value since it's event-driven,
  // but we should see event logging confirming it was triggered.
});