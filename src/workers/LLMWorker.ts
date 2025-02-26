import { EventBus } from "../infrastructure/EventBus.ts";
import { OpenAILLM } from "../infrastructure/OpenAILLM.ts";
import { ChatRequest } from "../domain/ChatRequest.ts";

const openAI = new OpenAILLM();

EventBus.subscribe("chat.requested", async (chatRequest: ChatRequest) => {
  try {
    console.log("🟢 Processing chat request with OpenAI...");
    const response = await openAI.generateResponse(chatRequest.messages, chatRequest.temperature, chatRequest.maxTokens);
    EventBus.publish("chat.completed", { response, provider: "OpenAI" }); // 🔥 Emit success event
  } catch (error) {
    console.warn("⚠️ OpenAI failed, switching to AWS Bedrock...");
  }
});