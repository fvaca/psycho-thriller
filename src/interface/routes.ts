import { handleLoginRequest, handleAuthVerifyRequest } from "./AuthController.ts";
import { handleChatRequest } from "./ChatController.ts";

export async function routeRequest(req: Request): Promise<Response> {
  if (req.url.endsWith("/auth/login") && req.method === "POST") {
    return await handleLoginRequest(req);
  }
  if (req.url.endsWith("/auth/verify") && req.method === "GET") {
    return await handleAuthVerifyRequest(req);
  }
  if (req.url.endsWith("/chat") && req.method === "POST") {
    return await handleChatRequest(req);
  }
  return new Response("Not Found", { status: 404 });
}