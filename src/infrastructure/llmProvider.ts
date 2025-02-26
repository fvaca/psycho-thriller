import { ChatMessage } from "../domain/ChatMessage.ts";

export interface LLMProvider {
  generateResponse(messages: ChatMessage[], temperature?: number, maxTokens?: number): Promise<string>;
}