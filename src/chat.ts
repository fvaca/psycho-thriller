import { z } from "npm:zod";
import { openAiChatCompletion } from "./stubs/stub-openai-client.ts";
import { bedrockChatCompletion } from "./stubs/stub-bedrock-client.ts";
import OpenAI from "openai";
import { Stream } from "openai/streaming";
import { ConverseStreamOutput, Message } from "@aws-sdk/client-bedrock-runtime";
import { time } from "node:console";
import { createError } from "./errorhandler.ts";


const contentPart = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.array(contentPart),
});

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
  temperature: z.number().optional(),
  max_tokens: z.number().optional(),
});
type ChatRequest = z.infer<typeof chatRequestSchema>;

interface ChatResponse {
  model: string;
  content: string;
}

export interface Chunk {
  delta: {
    content: string;
  };
}

export async function getChatResponse(
  chatRequest: ChatRequest, userId?: string
): Promise<ChatResponse> {

  try {
    const response = await streamChatResponse(chatRequest);

    let content = "";
    for await (const chunk of response.stream) {
      content += chunk.delta.content;
    }
  
    return {
      model: "gpt-4o",
      content,
    };  
  } catch (error) {   
    createError(error as Error , 400);      
    throw new Error("Failed to generate chat response.");
  }
  
}

export async function streamChatResponse(
  chatRequest: ChatRequest
): Promise<{ model: string; stream: AsyncIterable<Chunk> }> {

  let retries = 2; //Maximum of retries before falling back to AWS - Needs to be on config file
  while (retries >0) {
    try {
      console.log(`Attempting OpenAI (Retries Left: ${retries})`);

      return callOpenAI(chatRequest);
    } catch (e) {
      const error = e as Error;
      createError(error, 400, "Error streaming chat response");      
      console.warn("Error streaming chat response from OpenAI", e);
      retries -=1;
      
      if (retries === 0)
      {
        console.warn("OpenAI Failed After Retries, Switching to AWS Bedrock");
        return callBedrock(chatRequest);
      }
    }
    finally{
      console.log("Cleanup or logging can happen here if needed");
    }
  }
  const error = new Error("Unexpected error in retry logic");
  createError(error, 400, "Error streaming chat response");   
  throw error;
}

async function callOpenAI(chatRequest: ChatRequest
): Promise<{ model: string; stream: AsyncIterable<Chunk> }>{
  const stream = await openAiChatCompletion({
    model: "gpt-4o",
    messages: chatRequest.messages,
    stream: true,
    temperature: chatRequest.temperature,
    max_tokens: chatRequest.max_tokens,
  });
  return { model: "gpt-4o", stream: streamChunk(stream, (chunk) => chunk.choices[0].delta.content!) };
}

// Bedrock Fallback (Now in a Separate Function)
async function callBedrock(chatRequest: ChatRequest): Promise<{ model: string; stream: AsyncIterable<Chunk> }> {
  const systemMessage = chatRequest.messages.find(
    (message) => message.role === "system"
  );
  const iterator = await bedrockChatCompletion({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    system: systemMessage
      ? [
          {
            text: systemMessage.content[0].text,
          },
        ]
      : undefined,
    messages: chatRequest.messages.map(
      (message) =>
        ({
          role: "user",
          content: [
            {
              text: message.content[0].text,
            },
          ],
        } as Message)
    ),
    inferenceConfig: {
      temperature: chatRequest.temperature,
      maxTokens: chatRequest.max_tokens,
    }
  });
  return {
    model: "claude-3-sonnet",
    stream: streamChunk(iterator, (chunk) => chunk.contentBlockDelta!.delta!.text!),
  };
}
async function* streamChunk<T>(stream: AsyncIterable<T>, extractContent: (chunk: T) => string): AsyncIterable<Chunk> {
  
  for await (const chunk of stream) {
    yield {
      delta: {
        content: extractContent(chunk),
      },
    };
  }
}