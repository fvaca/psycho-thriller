interface User {
    username: string;
    password: string;
    role: string;
  }
  
  export class UserRepository {
    private users: User[] = [
      { username: "admin", password: "admin123", role: "admin" },
      { username: "user", password: "user123", role: "user" }
    ];
  
    async findUser(username: string): Promise<User | undefined> {
      return this.users.find(user => user.username === username);
    }
  }