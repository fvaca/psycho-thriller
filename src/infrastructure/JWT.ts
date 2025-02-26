import { JWTPayload, jwtVerify, SignJWT } from "npm:jose@5.9.6";


// Load environment variables
const SECRET_KEY = Deno.env.get("JWT_SECRET") || "default_secret_key";

// Convert secret key to Uint8Array for `jose`
const secret = new TextEncoder().encode(SECRET_KEY);

export class JWT {
  // Generate JWT token with 1-hour expiration
  static async generateToken(payload: JWTPayload): Promise<string> {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);
  }

  // Verify JWT token and return decoded payload
  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch (error) {
      console.error("❌ Invalid JWT:", error);
      return null;
    }
  }
}