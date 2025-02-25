import {
  chatRequestSchema,
  Chunk,
  getChatResponse,
  streamChatResponse,
} from "./chat.ts";
import { createError } from "./errorhandler.ts";

const CHAT_ROUTE = new URLPattern({ pathname: "/chat" });
const STREAM_CHAT_ROUTE = new URLPattern({ pathname: "/chat/stream" });

//Rate limit storage
// let requestCounts = new Map<string, {count: number; resetTime: number}>();
// const RATE_LIMIT = 5; //Max request per minute
// const RATE_WINDOW = 60 * 1000; // 60 seconds

// //Rate limiting function
// function isRateLimited(userId: string): boolean{
//   const now = Date.now();

//   if(!requestCounts.has(userId)){
//     requestCounts.set(userId, {count: 1, resetTime: now + RATE_WINDOW});
//     setTimeout(() => requestCounts.delete(userId), RATE_WINDOW);
//     return false;
//   }
  
//   const userData = requestCounts.get(userId);
//   if(usesrData.count >= RATE_LIMIT){
//     return true;
//   } 

//   userData.count++;
//   return false;
// }

// Handle chat request
export async function handleChatRequest(req: Request): Promise<Response> {
  try {

    // const userId = req.headers.get("x-user-id") || "unknown"; // Extract user ID (or assign 'unknown')
    // if(isRateLimited(userId)){
    //   return new Response("Rate limit exceeded. Try again later.", { status: 429 });
    // } 

    // console.log(`Processing chat request from User: ${userId}`);

    const body = await req.json();
    const parsedBody = chatRequestSchema.safeParse(body);

    if (parsedBody.success) {
      const response = await getChatResponse(parsedBody.data);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "content-type": "application/json", "x-model": response.model },
      });
    } else {      
      const parsederror = new Error(JSON.stringify(parsedBody.error));
      return new Response(createError(parsederror, 400));
    }

  } catch (error) {
    return new Response(createError(error as Error, 400, "Failed to generate chat response."));   
  }
}


//Stream chat request handler
export async function handleStreamChatRequest(req: Request): Promise<Response> {
  try {

    // const userId = req.headers.get("x-user-id") || "unknown"; // Extract user ID (or assign 'unknown')
    // if(isRateLimited(userId)){
    //   return new Response("Rate limit exceeded. Try again later.", { status: 429 });
    // } 

    // console.log(`Processing chat request from User: ${userId}`);

    const body = await req.json();
    const parsedBody = chatRequestSchema.safeParse(body);
  
    if (parsedBody.success) {
      const response = await streamChatResponse(parsedBody.data);
      return new Response(toUint8ArrayStream(response.stream), {
        status: 200,
        headers: { "content-type": "text/plain", "x-model": response.model },
      });
    } else {
      const parsederror = new Error(JSON.stringify(parsedBody.error));
      return new Response(createError(parsederror, 400));
    }
  } catch (error) {
    return new Response(createError(error as Error, 400, "Failed to generate chat response."));    
  }
}

//function to convert AsyncIterable to ReadableStream
function toUint8ArrayStream(
  iterable: AsyncIterable<Chunk>
): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const chunk of iterable) {
        controller.enqueue(new TextEncoder().encode(JSON.stringify(chunk)));
      }
      controller.close();
    },
  });
}

// // Route request
async function handler(_req: Request): Promise<Response> {
  if(CHAT_ROUTE.test(_req.url) && _req.method === "POST")
      return await handleChatRequest(_req);

  if (STREAM_CHAT_ROUTE.test(_req.url) && _req.method === "POST")
      return await handleStreamChatRequest(_req);

  return new Response(createError(new Error("Not found"), 404));
}

Deno.serve({ port: 3000 }, handler);
