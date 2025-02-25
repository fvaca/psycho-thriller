import { assert, assertEquals } from "@std/assert";
import * as _server from "./src/server.ts";
import * as _chat from "./src/chat.ts";
import { createError } from "./src/errorhandler.ts";

// Deno.test(function addTest() {
//   assertEquals(add(2, 3), 5);
// });

// === Unit Tests for SERVER===


// === Unit Tests for CHAT===
//Unit Test for single response
//We need to test:
// 	•	Valid input returns a response.
// 	•	If OpenAI fails, AWS Bedrock takes over.
Deno.test("Valid input returns a response", async () => {
  
  const chatRequest  = _chat.chatRequestSchema.safeParse({
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Tell me a joke"
                }
            ]
        }
    ],
    "temperature": 1,
    "max_tokens": 1000
  });
  if (chatRequest.success) {
    const response = await _chat.getChatResponse(chatRequest.data);
    assertEquals(response.model, "gpt-4o");
    assert(response.content.length > 0, "Response should not be empty");
  }
  
});

//Unit Test for stream response
//We need to test:
// 	•	Valid input returns a stream response.
// 	•	If OpenAI fails, AWS Bedrock takes over.
Deno.test("Valid input returns a stream response", async () => {
  const chatRequest  = _chat.chatRequestSchema.safeParse({
    message: [{role: "user", content: [{text: "Hello", type: "text"}] }],
    temperature: 0.5,
  });
  if (chatRequest.success) {
    const response = await _chat.streamChatResponse(chatRequest.data);
    let content = "";
    for await (const chunk of response.stream) {
      content += chunk.delta.content;
    }
    assertEquals(response.model, "gpt-4o");
    assert(content.length > 0, "Response should not be empty");
  
  }
});

//unit test for error handling
//We need to test:
// 	•	Invalid input returns an error.
// 	•	If OpenAI fails, AWS Bedrock takes over.
Deno.test("Invalid input returns an error", async () => {
  const chatRequest  = _chat.chatRequestSchema.safeParse({
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Tell me a joke"
                }
            ]
        }
    ],
    "temperature": 1,
    "max_tokens": 1000
  });
  try {
    
    await _chat.getChatResponse(chatRequest.success ? chatRequest.data : {messages: [], temperature: 0});
  } catch (error) {
    assert(error instanceof Error, "Error should be an instance of Error");
  }
});
     

