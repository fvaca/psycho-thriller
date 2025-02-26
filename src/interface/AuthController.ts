import { AuthService } from "../application/AuthService.ts";

const authService = new AuthService();

export async function handleLoginRequest(req: Request): Promise<Response> {
  try {
    const { username, password } = await req.json();
    
    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 });
    }

    const token = await authService.login(username, password);

    if (!token) {
      return new Response(JSON.stringify({ error: "Invalid username or password" }), { status: 401 });
    }

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
}

export async function handleAuthVerifyRequest(req: Request): Promise<Response> {
  try {
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing token" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const isValid = await authService.verifyToken(token);

    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: "Token is valid" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
}