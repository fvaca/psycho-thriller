import { EventBus } from "../infrastructure/EventBus.ts";
import { UserRepository } from "../infrastructure/UserRepository.ts";
import { JWT } from "../infrastructure/JWT.ts";

export class AuthService {
  private userRepository = new UserRepository();

  async login(username: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findUser(username);

    if (!user || user.password !== password) {
      EventBus.publish("auth.failed", { username });
      return null;
    }

    const token = await JWT.generateToken({ username, role: user.role });
    EventBus.publish("auth.success", { username });
    return token;
  }

  async verifyToken(token: string): Promise<boolean> {
    return await JWT.verifyToken(token) !== null;
  }
}