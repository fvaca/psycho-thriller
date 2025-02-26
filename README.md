# psycho-thriller
deno run --allow-read --allow-env 
deno run --allow-net --allow-read --allow-write --allow-env src/server.ts
deno run --allow-net --allow-read --allow-env src/server.ts

deno run --allow-env 

We need to use deno-dotenv to load environment variables.


/src
│── /application
│   ├── AuthService.ts      # Handles authentication logic
│
│── /infrastructure
│   ├── EventBus.ts         # Event-driven pub/sub system
│   ├── JWT.ts              # JWT signing and verification
│   ├── UserRepository.ts   # Manages user data (mock DB)
│
│── /interface
│   ├── routes.ts           # API routes
│   ├── AuthController.ts   # Handles HTTP requests for authentication
│
│── /workers
│   ├── AuthWorker.ts       # Listens for authentication events
│
│── server.ts               # Starts the HTTP server & loads routes