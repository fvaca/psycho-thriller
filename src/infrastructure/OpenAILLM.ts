import { LLMProvider } from "./llmProvider.ts";
import { ChatMessage } from "../domain/ChatMessage.ts";
import OpenAI from "openai";
import { Stream } from "openai/streaming";


const OPENAI_ORGANIZATION = Deno.env.get("OPENAI_ORGANIZATION");
const OPENAI_PROJECT = Deno.env.get("OPENAI_PROJECT");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

export class OpenAILLM implements LLMProvider {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
          organization: OPENAI_ORGANIZATION,
          project: OPENAI_PROJECT,
          apiKey: OPENAI_API_KEY,
        });
      }

    async generateResponse(messages: ChatMessage[], temperature?: number, maxTokens?: number) {
        const response = await await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
        stream: false,
        temperature,
        max_tokens: maxTokens,
        });
        return response.choices[0].text;
    }

    // async openAICaller(input: OpenAI.Chat.ChatCompletionCreateParamsStreaming): Promise<Stream<OpenAI.Chat.ChatCompletionChunk>> {
    //     const localInput= {
    //       model: "gpt-4o-mini",
    //       messages: [{ role: "user", content: "Say this is a test" }],
    //       store: true,
    //       stream: true,
    //     };
        
    //     return await this.openai.chat.completions.create(input);
    //   }
}