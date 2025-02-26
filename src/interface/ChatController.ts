import { EventBus } from "../infrastructure/EventBus.ts";
import { chatRequestSchema } from "../domain/ChatRequest.ts";



export async function handleChatRequest(req: Request): Promise<Response> {
    try {
      const body = await req.json();
      const parsed = chatRequestSchema.safeParse(body);
  
      if (!parsed.success) {
        return new Response(
          JSON.stringify({ error: parsed.error.format() }),
          { status: 400, headers: { "content-type": "application/json" } }
        );
      }
      
  
      // Emit event instead of calling the function directly
      EventBus.publish("chat.requested", parsed.data);
  
      return new Response(
        JSON.stringify({ message: "Chat request received, processing..." }),
        { status: 202, headers: { "content-type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: (error as Error).message }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }
  }