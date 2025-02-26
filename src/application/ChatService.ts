import { ChatRequest } from "../domain/ChatRequest.ts";
import { EventBus } from "../infrastructure/EventBus.ts";
import { log } from "../infrastructure/Logger.ts";
import { OpenAILLM } from "../infrastructure/OpenAILLM.ts"; // Import OpenAI client

export class ChatService {
  async processChat(chatRequest: ChatRequest) {
    log("info", `Received chat request: ${JSON.stringify(chatRequest)}`);
    EventBus.publish("chat.requested", chatRequest); // 🔥 Emit event

    // // Call OpenAI API and return response
    // try {
    //   const response = await OpenAILLM.getChatResponse(chatRequest);
    //   return response;
    // } catch (error) {
    //   log("error", `Failed to fetch OpenAI response: ${error}`);
    //   throw new Error("Error processing chat request.");
    // }
  }
}